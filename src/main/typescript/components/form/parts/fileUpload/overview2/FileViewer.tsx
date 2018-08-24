import * as React from "react"
import { Component } from "react"

import * as Moment from "moment"

import FileBrowser from "react-keyed-file-browser"
import FileViewerHeader from "./FileViewerHeader"

interface FileElement {
    key: string
    modified?: number
    size?: number
}

interface FileViewerState {
    files: FileElement[]
}

class FileViewer extends Component<{}, FileViewerState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            files: [
                {
                    key: "photos/animals/cat in a hat.png",
                    modified: +Moment().subtract(1, "hours"),
                    size: 1.5 * 1024 * 1024,
                },
                {
                    key: "photos/animals/kitten_ball.png",
                    modified: +Moment().subtract(3, "days"),
                    size: 545 * 1024,
                },
                {
                    key: "photos/animals/elephants.png",
                    modified: +Moment().subtract(3, "days"),
                    size: 52 * 1024,
                },
                {
                    key: "photos/funny fall.gif",
                    modified: +Moment().subtract(2, "months"),
                    size: 13.2 * 1024 * 1024,
                },
                {
                    key: "photos/holiday.jpg",
                    modified: +Moment().subtract(25, "days"),
                    size: 85 * 1024,
                },
                {
                    key: "documents/letter chunks.doc",
                    modified: +Moment().subtract(15, "days"),
                    size: 480 * 1024,
                },
                {
                    key: "documents/export.pdf",
                    modified: +Moment().subtract(15, "days"),
                    size: 4.2 * 1024 * 1024,
                },
            ],
        }
    }

    handleCreateFolder = (key: string) => {
        this.setState(state => ({
            files: state.files.concat([{ key: key }]),
        }))
    }
    handleCreateFiles = (files: { name: string, size: number }[], prefix: string) => {
        this.setState(state => {
            const uniqueNewFiles = files
                .map(file => ({
                    key: `${prefix}${prefix !== "" && !prefix.endsWith("/") ? "/" : ""}${file.name}`,
                    size: file.size,
                    modified: +Moment(),
                }))
                .filter(newFile => !state.files.find(existingFile => existingFile.key === newFile.key))
            return { files: state.files.concat(uniqueNewFiles) }
        })
    }

    handleRenameFolder = (oldKey: string, newKey: string) => {
        this.setState(state => {
            const newFiles = state.files.map((file) => {
                if (file.key.startsWith(oldKey))
                    return {
                        ...file,
                        key: file.key.replace(oldKey, newKey),
                        modified: +Moment(),
                    }
                else
                    return file
            })
            return { files: newFiles }
        })
    }
    handleRenameFile = (oldKey: string, newKey: string) => {
        this.setState(state => {
            const newFiles = state.files.map((file) => {
                if (file.key === oldKey)
                    return {
                        ...file,
                        key: newKey,
                        modified: +Moment(),
                    }
                else
                    return file
            })
            return { files: newFiles }
        })
    }
    handleDeleteFolder = (folderKey: string) => {
        this.setState(state => {
            const newFiles = state.files.filter((file) => file.key.startsWith(folderKey))
            return { files: newFiles }
        })
    }
    handleDeleteFile = (fileKey: string) => {
        this.setState(state => {
            const newFiles = state.files.filter((file) => file.key !== fileKey)
            return { files: newFiles }
        })
    }

    render() {
        return (
            <FileBrowser
                files={this.state.files}

                renderStyle="table"
                headerRenderer={FileViewerHeader}
                detailRenderer={() => <div/>}

                onCreateFolder={this.handleCreateFolder}
                onCreateFiles={this.handleCreateFiles}
                onMoveFolder={this.handleRenameFolder}
                onMoveFile={this.handleRenameFile}
                onRenameFolder={this.handleRenameFolder}
                onRenameFile={this.handleRenameFile}
                onDeleteFolder={this.handleDeleteFolder}
                onDeleteFile={this.handleDeleteFile}
            />
        )
    }
}

export default FileViewer
