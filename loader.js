
void (async () => {
  if (window.__loaderImported === true) {
    console.log('Panic: Plugin loader already imported.\nplease do not import plugin loader twice')
    return
  }
  
  window.__loaderImported = true
  console.log({ type: 'system', message: 'Plugin loader imported. use plist`` to list available plugins' })

  await import('//c.pmh.codes/core.js')
  await import('//c.pmh.codes/basic.js')

  let plugins = []
  let importedPlugins = ['basic']

  async function plist () {
    plugins = await fetch('https://c.pmh.codes/plugins.json')
      .then((res) => res.json())
      .catch(() => ([]))

    if (plugins.length < 1) {
      console.log('Panic: unable to read plugin list')
      return
    }

    const pluginListString =
      plugins.reduce((prev, curr) =>
        `${prev}\n` +
        `${curr.id} - ${curr.name} (by ${curr.author})`,
        ':: Plugin List ::\n') + '\n\n' +
        'use load`<plugin_id>` to load plugin (ex: load`basic`)\n' +
        'use plist`` to refresh plugin list\n' +
        'use help`<plugin_id>` to read plugin manual\n'

    console.log(pluginListString)
  }

  window.plist = plist
  window.load = async ([pluginId]) => {
    const plugin = plugins.find((p) => p.id === pluginId)
    if (!plugin) {
      console.log(`Plugin "${pluginId}" not found. please try again.`)
      return
    }

    if (importedPlugins.includes(plugin.id)) {
      console.log(`Plugin "${pluginId}" already imported.\nplease avoid import same plugin twice. (use F5 to unload plugins)`)
      return
    }

    importedPlugins.push(plugin.id)
    await import(plugin.url)
  }

  window.help = async ([pluginId]) => {
    const plugin = plugins.find((p) => p.id === pluginId)

    if (!plugin) {
      console.log(`Plugin "${pluginId}" not found. please try again.`)
      return
    }

    if (!plugin.manual) {
      console.log(`Plugin "${pluginId}"'s manual not found. please try again later...`)
      return
    }

    const manual = await fetch(plugin.manual)
      .then((res) => res.text())
      .catch(() => 'Fail to read manual file')

    console.log(manual)
  }
})()
