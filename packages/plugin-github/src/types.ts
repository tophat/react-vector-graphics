import type { Octokit } from "@octokit/rest"

export type PluginGitHubOptions = {
    'github/api': Octokit

    'github/base': string
    'github/commitCreate'?: string
    'github/commitDelete'?: string
    'github/commitUpdate'?: string
    'github/folderPath': string
    'github/head': string
    'github/owner': string
    'github/repo': string
    'assets/fileExt': string
    'assets/globPattern': string
    'assets/nameScheme': string
    'assets/outputPath': string
}
