import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/, '')

        const fullpath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullpath, 'utf8')

        const matterResult = matter(fileContents)

        return {
            id,
            ...(matterResult.data as { date: string; title: string })
        }
    })

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export async function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames.map(fileName => {
        params: {
            id: fileName.replace(/\.md$/, '')
        }
    })
}

export async function getPostData(id: string) {
    const fullpath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullpath, 'utf8')

    const matterResult = matter(fileContents)

    const processesContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processesContent.toString()

    return {
        id,
        contentHtml,
        ...(matterResult.data as { date: string; title: string })
    }
}