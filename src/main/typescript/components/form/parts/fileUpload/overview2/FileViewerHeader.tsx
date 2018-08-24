import * as React from "react"
import { Component } from "react"
import ClassNames from "classnames"
import { DropTarget } from "react-dnd"
import { NativeTypes } from "react-dnd-html5-backend"
import { BaseFileConnectors } from "react-keyed-file-browser"

interface RawFileViewerHeaderProps {
    select: (s: string) => any
    fileKey: string

    connectDropTarget: (a: any) => any
    isOver: boolean
    isSelected: (a: any) => any

    browserProps: {
        createFiles: (a: any) => any
        moveFolder: (a: any) => any
        moveFile: (a: any) => any
    }
}

class RawFileViewerHeader extends Component<RawFileViewerHeaderProps> {

    constructor(props: RawFileViewerHeaderProps) {
        super(props)
        console.log("constructor")
    }

    handleHeaderClick = () => this.props.select(this.props.fileKey)

    render() {
        console.log("FileViewerHeader", this.props)
        const header = (
            <tr className={ClassNames("folder", {
                dragover: this.props.isOver,
                selected: this.props.isSelected,
            })}>
                <th>File</th>
                <th className="size">Size</th>
                <th className="modified">Last Modified</th>
            </tr>
        )

        if (typeof this.props.browserProps.createFiles === "function" ||
            typeof this.props.browserProps.moveFile === "function" ||
            typeof this.props.browserProps.moveFolder === "function")
            return this.props.connectDropTarget(header)
        else
            return header
    }
}

@DropTarget(
    ['file', 'folder', NativeTypes.FILE],
    BaseFileConnectors.targetSource,
    BaseFileConnectors.targetCollect,
)
class FileViewerHeader extends RawFileViewerHeader {}

export default FileViewerHeader
