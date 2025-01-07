import Editor, { useEditor } from "./components/Editor";

export default function App() {
	const editorState = useEditor();

	return (
		<>
			<Editor {...editorState} />
			<pre>{JSON.stringify(editorState.blocks, null, 2)}</pre>
		</>
	);
}
