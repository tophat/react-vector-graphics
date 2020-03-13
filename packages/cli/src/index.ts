import { loadConfig } from './config'
import { run } from './main'

export default (): Promise<void> => loadConfig(process.cwd()).then(run)
