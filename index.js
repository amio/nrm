#!/usr/bin/env node

const padEnd = require('string.prototype.padend')
const exec = require('child_process').exec
const args = require('minimist')(process.argv.slice(2))

const registries = require('./registries.json')
const subCommand = args._[0] || ''
const commandArgs = args._.slice(1) || []

args.h && process.exit(help())
args.v && process.exit(version())
args.version && process.exit(version())

switch (subCommand) {
  case 'ls':
    list()
    break
  case 'use':
    use(commandArgs[0])
    break
  default:
    help()
}

function list () {
  const cmd = 'npm config get registry'
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return console.error(`'${cmd}' error: ${error}`)
    }

    Object.keys(registries).map(k => {
      const reg = registries[k].registry
      const currentTag = reg === stdout.trim() ? ' * ' : '   '
      const lineOutput = currentTag + `${padEnd(k, 10)} ${reg}`
      process.stdout.write('\n' + lineOutput)
    })
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
      console.log(`\nRegistry has been set to: ${registry.registry}\n`)
    })
  }
}

function help () {
  console.log(`
    Usage: nr [command]

    Commands:

      ls                List all available registries
      use <registry>    Change npm registry to <registry>
      help              Print this help

    Options:

      -h, --help        output usage information
      -v, --version     output the version number
  `)
  return 0
}

function version () {
  console.log('v' + require('./package.json').version)
  return 0
}
