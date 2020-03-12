import { loadConfig } from './config'
import { run } from './main'

loadConfig(process.cwd()).then(run)
