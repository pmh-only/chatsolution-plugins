void (async () => {
  console.log(`

    #######################
    ### Chat Solution   ###
    ###   Plugin Loader ###
    #######################

    Reading plugin list...

  `)

  let plugins = []

  async function refresh () {
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
        'use load`<plugin_name>` to load plugin (ex: load`basic`)\n' +
        'use refresh`` to refresh plugin list\n' +

    console.log(pluginListString)
  }

  refresh()
  window.refresh = refresh

  window.load = async ([pluginId]) => {
    const plugin = plugins.find((p) => p.id === pluginId)
    if (!plugin) {
      console.log(`Plugin "${pluginId}" not found. please try again.`)
      return
    }

    if (window.__core === undefined)
      await import('//c.pmh.codes/core.js')

    await import(plugin.url)
  }
})()
