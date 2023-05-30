void (async () => {
  console.log(`

    #######################
    ### Chat Solution   ###
    ###   Plugin Loader ###
    #######################

    Reading plugin list...

  `)

  const plugins =
    await fetch('https://c.pmh.codes/plugins.json')
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
      'use load`<plugin_name>` to load plugin (ex: load`basic`)'

  console.log(pluginListString)

  window.load = ([pluginId]) => {
    const plugin = plugins.find((p) => p.id === pluginId)
    if (!plugin) {
      console.log(`Plugin "${pluginId}" not found. please try again.`)
      return
    }

    import(plugin.url)
    window.load = undefined
  }
})()
