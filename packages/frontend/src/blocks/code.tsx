import { createReactBlockSpec } from "@blocknote/react";
import {
	type BlockNoteEditor,
	type BlockSchema,
	type InlineContentSchema,
	insertOrUpdateBlock,
	type StyleSchema,
} from "@blocknote/core";
import { MdCode } from "react-icons/md";
import ReactCodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";

const TYPE = "codeBlock";

export const CodeMirrorBlock = createReactBlockSpec(
	{
		type: TYPE,
		propSchema: {
			data: {
				//@ts-ignore
				language: "javascript",
				code: "",
			},
		},
		content: "none",
	},
	{
		render: ({ block, editor }) => {
			const { data } = block.props;

			const onInputChange = (val: string) => {
				editor.updateBlock(block, {
					//@ts-ignore
					props: { ...block.props, data: val },
				});
			};

			return (
				<ReactCodeMirror
					id={block?.id}
					autoFocus
					placeholder={"Write your code here..."}
					style={{ width: "100%", resize: "vertical" }}
					//@ts-ignore
					extensions={[langs[data?.language ? data?.language : "javascript"]()]}
					value={data}
					theme={"dark"}
					editable={editor.isEditable}
					width="100%"
					height="200px"
					onChange={onInputChange}
				/>
			);
		},
		toExternalHTML: ({ block }) => {
			return (
				<pre>
					<code>{block?.props?.data}</code>
				</pre>
			);
		},
	},
);

export const insertCodeMirror = <
	BSchema extends BlockSchema,
	I extends InlineContentSchema,
	S extends StyleSchema,
>(
	editor: BlockNoteEditor<BSchema, I, S>,
) => ({
	title: "Code Mirror",
	group: "Basic blocks",
	onItemClick: () => {
		insertOrUpdateBlock(editor, {
			//@ts-ignore
			type: TYPE,
		});
	},
	aliases: ["code"],
	icon: <MdCode />,
	subtext: "Insert a code block.",
});
