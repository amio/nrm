const exec = require('child_process').exec
const args = require('minimist')(process.argv.slice(2))

const registries = require('./registries.json')
const subCommand = args._[0] || ''
const commandArgs = args._.slice(1) || []

switch (subCommand) {
  case 'ls':
    list()
    break
  case 'use':
    use(commandArgs[0])
    break
}

function list () {
  const cmd = 'npm config get registry'
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return console.error(`'${cmd}' error: ${error}`)
    }

    for (let name in registries) {
      const reg = registries[name].registry
      const currentTag = reg === stdout.trim() ? ' * ' : '   '
      const lineOutput = currentTag + `${name} - ${reg}`
      process.stdout.write('\n' + lineOutput)
    }
    process.stdout.write('\n\n')

    if (stderr) {
      process.exit(stderr)
    }
  })
}

function use (registryAlias) {
  const registry = registries[registryAlias]
  if (!registry) {
    process.stdout.write(`Unknown registry alias: ${registryAlias}`)
    process.exit(1)
  } else {
    const cmd = `npm config set registry ${registry.registry}`
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return console.error(`'${cmd}' error: ${error}`)
      }
      process.stdout.write(`\nRegistry has been set to: ${registry.registry}\n\n`)
    })
  }
}
