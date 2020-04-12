import { findConfig } from './config'
import { run } from './main'

export default (): Promise<void> => findConfig(process.cwd()).then(run)
