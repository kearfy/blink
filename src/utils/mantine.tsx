import {
	ActionIcon,
	Alert,
	Checkbox,
	Drawer,
	Indicator,
	Modal,
	Overlay,
	Popover,
	Radio,
	Select,
	Slider,
	Switch,
	Tabs,
	TagsInput,
	TextInput,
	Tooltip,
	createTheme,
	rem,
} from "@mantine/core";

/**
 * The Mantine theme configurtation
 */
export const MANTINE_THEME = createTheme({
	fontFamily: `Poppins, -apple-system, ui-sans-serif, system-ui, Inter, "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
	fontFamilyMonospace: `JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
	primaryColor: "dark",
	primaryShade: 9,
	defaultRadius: "md",
	fontSizes: {
		xs: rem(10),
		sm: rem(11),
		md: rem(12),
		lg: rem(14),
		xl: rem(16),
	},
	headings: {
		sizes: {
			h1: { fontSize: rem(22), fontWeight: "700" },
			h2: { fontSize: rem(20), fontWeight: "600" },
			h3: { fontSize: rem(18), fontWeight: "500" },
		},
	},
	spacing: {
		xs: rem(6),
		sm: rem(9),
		md: rem(12),
		lg: rem(16),
		xl: rem(20),
	},
	radius: {
		xs: rem(7),
		sm: rem(9),
		md: rem(11),
		lg: rem(15),
		xl: rem(19),
	},
	components: {
		Modal: Modal.extend({
			defaultProps: {
				centered: true,
				withCloseButton: false,
				padding: 24,
			},
		}),
		Overlay: Overlay.extend({
			defaultProps: {
				blur: 5,
				color: "#06060d",
			},
		}),
		Popover: Popover.extend({
			defaultProps: {
				shadow: "0 6px 12px 2px rgba(0, 0, 0, 0.15)",
			},
		}),
		ActionIcon: ActionIcon.extend({
			defaultProps: {
				variant: "light",
				color: "slate",
				radius: "xs",
			},
		}),
		Select: Select.extend({
			defaultProps: {
				allowDeselect: false,
			},
		}),
		Radio: Radio.extend({
			styles: {
				label: {
					display: "block",
				},
			},
		}),
		Slider: Slider.extend({
			defaultProps: {
				color: "slate.2",
			},
		}),
		Tabs: Tabs.extend({
			defaultProps: {
				variant: "pills",
			},
			styles: {
				tab: {
					fontWeight: 600,
					minHeight: 30,
				},
			},
		}),
		Checkbox: Checkbox.extend({
			defaultProps: {
				color: "transparent",
				radius: 5,
			},
		}),
		Switch: Switch.extend({
			styles: {
				root: {
					display: "flex",
				},
			},
		}),
		Indicator: Indicator.extend({
			styles: {
				root: {
					zIndex: 0,
				},
			},
		}),
		TagsInput: TagsInput.extend({
			styles: {
				pill: {
					backgroundColor: "var(--mantine-color-surreal-6)",
				},
				input: {
					display: "flex",
				},
			},
		}),
		TextInput: TextInput.extend({
			defaultProps: {
				spellCheck: false,
			},
		}),
		Alert: Alert.extend({
			styles: {
				title: {
					fontSize: "var(--mantine-font-size-md)",
				},
				message: {
					fontSize: "var(--mantine-font-size-md)",
				},
			},
		}),
		Tooltip: Tooltip.extend({
			defaultProps: {
				transitionProps: { transition: "pop" },
				radius: "xs",
				p: "sm",
			},
			styles: {
				tooltip: {
					color: "white",
					padding: 4,
					backgroundColor: "rgba(0, 0, 0, 0.7)",
					backdropFilter: "blur(4px)",
					WebkitBackdropFilter: "blur(4px)",
				},
			},
		}),
		Drawer: Drawer.extend({
			defaultProps: {
				withCloseButton: false,
				padding: "lg",
				offset: 14,
				radius: "md",
			},
			styles: {
				inner: {
					inset: 0,
					width: "unset",
				},
			},
		}),
	},
});
