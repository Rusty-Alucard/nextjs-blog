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
            ...matterResult.data
        }
    })

    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1
        } else if (a > b) {
            return -1
        } else {
            return 0
        }
    })
}

export async function getAllPostIds() {
    const res = await fetch('..')
    const posts = await res.json()

    return posts.map(post => {
        return {
            params: {
                id: post.id
            }
        }
    })
}

export async function getPostData(id) {
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
        ...matterResult.data
    }
}