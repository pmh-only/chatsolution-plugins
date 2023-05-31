void (async () => {
  if (window.__loaderImported === true) {
    console.log('Panic: Plugin loader already imported.\nplease do not import plugin loader twice')
    return
  }
  
  window.__loaderImported = true
  console.log('Plugin loader imported. use plist`` to list available plugins')

  await import('//c.pmh.codes/core.js')
  await import('//c.pmh.codes/basic.js')
  console.log(`Core and Plugin "basic" loaded`)

  let importedPlugins = ['loader', 'core', 'basic']
  const plugins =
    await fetch('https://c.pmh.codes/plugins.json')
      .then((res) => res.json())
      .catch(() => ([]))

  if (plugins.length < 1) {
    console.log('Panic: unable to read plugin list')
    return
  }

  async function plist () {
    const pluginListString =
      plugins.reduce((prev, curr) =>
        `${prev}\n` +
        `${curr.id} - ${curr.name.slice(0, 51)}${curr.name.length > 50 ? '...' : ''} (by ${curr.author})`,
        ':: Plugin List ::\n') + '\n\n' +
        'use pload`<plugin_id>` to load plugin (ex: load`basic`)\n' +
        'use plist`` to refresh plugin list\n' +
        'use phelp`<plugin_id>` to read plugin manual\n'

    console.log(pluginListString)
  }

  window.plist = plist
  window.pload = async ([pluginId], hideAlready = false) => {
    if (pluginId === '*') {
      console.log(`Loading all plugins...`)
      for (const plugin of plugins)
        window.pload([plugin.id], true)

      return
    }

    console.log(`Loading plugin "${pluginId}"...`)
    
    const plugin = plugins.find((p) => p.id === pluginId)
    if (!plugin) {
      console.log(`Plugin "${pluginId}" not found. please try again.`)
      return
    }

    if (importedPlugins.includes(plugin.id)) {
      if (hideAlready) return

      console.log(`Plugin "${pluginId}" already imported.\nplease avoid import same plugin twice. (use F5 to unload plugins)`)
      return
    }

    for (const dep of plugin.deps || []) {
      if (importedPlugins.includes(dep)) continue
      const findDep = plugins.find((p) => p.id === dep)
      
      if (!findDep) {
        console.log(`Dependancy plugin of "${pluginId}", "${dep}"'s not found... please try again later`)
        return
      }
      
      importedPlugins.push(findDep.id)
      await import(findDep.url)
    }
    
    importedPlugins.push(plugin.id)
    await import(plugin.url)
    console.log(`Plugin "${pluginId}" + ${plugin.deps?.length ?? 0} dependencies loaded`)
  }

  window.phelp = async ([pluginId]) => {
    console.log(`Loading plugin "${pluginId}"'s manual...`)
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

  window.__loader = {
    getPlugins: () => plugins,
    getImportedPlugins: () => importedPlugins
  }
})()
