const logStyle = [
  '%cLoader', `
  display: inline-block;
  background-color: #6c757d;
  color: #000;
  font-weight: bold;
  padding: 0px 3px;
  border-radius: 3px;`
]

void (async () => {
  if (window.__loaderImported === true) {
    console.log(...logStyle, 'Plugin loader already imported.\nplease do not import plugin loader twice')
    return
  }
  
  window.__loaderImported = true
  console.log(...logStyle, 'Plugin loader imported.\nuse plist`` to list available plugins\nuse pload`*` to load all plugins')

  await import('//c.pmh.codes/core.js')
  await import('//c.pmh.codes/basic.js')
  console.log(...logStyle, `Core and Plugin "basic" loaded`)

  let importedPlugins = ['loader', 'core', 'basic']
  const plugins =
    await fetch('https://c.pmh.codes/plugins.json')
      .then((res) => res.json())
      .catch(() => ([]))

  if (plugins.length < 1) {
    console.log(...logStyle, 'unable to read plugin list')
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

    console.log(...logStyle, pluginListString)
  }

  window.plist = plist
  window.pload = async ([pluginId], hideAlready = false) => {
    if (pluginId === '*') {
      console.groupCollapsed(...logStyle, `Loading all plugins...`)
      for (const plugin of plugins)
        await window.pload([plugin.id], true)
          .catch(() => {})

      console.groupEnd()
      console.log(...logStyle, 'All plugins loaded')

      return
    }

    console.log(...logStyle, `Loading plugin "${pluginId}"...`)
    
    const plugin = plugins.find((p) => p.id === pluginId)
    if (!plugin) {
      console.log(...logStyle, `Plugin "${pluginId}" not found. please try again.`)
      return
    }

    if (importedPlugins.includes(plugin.id)) {
      if (hideAlready) return

      console.log(...logStyle, `Plugin "${pluginId}" already imported.\nplease avoid import same plugin twice. (use F5 to unload plugins)`)
      return
    }

    for (const dep of plugin.deps || []) {
      if (importedPlugins.includes(dep)) continue
      const findDep = plugins.find((p) => p.id === dep)
      
      if (!findDep) {
        console.log(...logStyle, `Dependancy plugin of "${pluginId}", "${dep}"'s not found... please try again later`)
        return
      }
      
      importedPlugins.push(findDep.id)
      await import(findDep.url)
    }
    
    importedPlugins.push(plugin.id)
    await import(plugin.url)
    console.log(...logStyle, `Plugin "${pluginId}" + ${plugin.deps?.length ?? 0} dependencies loaded`)
  }

  window.phelp = async ([pluginId]) => {
    console.log(...logStyle, `Loading plugin "${pluginId}"'s manual...`)
    const plugin = plugins.find((p) => p.id === pluginId)

    if (!plugin) {
      console.log(...logStyle, `Plugin "${pluginId}" not found. please try again.`)
      return
    }

    if (!plugin.manual) {
      console.log(...logStyle, `Plugin "${pluginId}"'s manual not found. please try again later...`)
      return
    }

    const manual = await fetch(plugin.manual)
      .then((res) => res.text())
      .catch(() => 'Fail to read manual file')

    console.log(...logStyle, manual)
  }

  window.__loader = {
    getPlugins: () => plugins,
    getImportedPlugins: () => importedPlugins,
    _unload: () => {
      window.pload = undefined
      window.plist = undefined
      window.phelp = undefined
      window.__loaderImported = undefined
    }
  }
})()
