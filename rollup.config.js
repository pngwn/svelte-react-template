import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import postcss from 'rollup-plugin-postcss-modules'
import autoprefixer from 'autoprefixer'

# import typescript from 'rollup-plugin-typescript2' // support TS config?

const production = !process.env.ROLLUP_WATCH;

export default {
	input: "src/main.js",
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "public/build/bundle.js"
	},
	plugins: [
		postcss({
		    extract: true,  // extracts to `${basename(dest)}.css`
		    plugins: [autoprefixer()],
		    writeDefinitions: true,
		    // modules: { ... }
		}),
		// typescript(),
		replace({
			"process.env.NODE_ENV": JSON.stringify(production)
		}),
		babel({
			exclude: "node_modules/**",
			presets: ["@babel/env", "@babel/preset-react"]
		}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write("public/build/bundle.css");
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee =>
				importee === "svelte" || importee.startsWith("svelte/")
		}),
		commonjs({
			include: ["node_modules/**"],
			exclude: ["node_modules/process-es6/**"],
			namedExports: {
				"node_modules/react/index.js": [
					"Children",
					"Component",
					"PropTypes",
					"createElement",
					"useRef",
					"useState",
					"useEffect"
				],
				"node_modules/react-dom/index.js": ["render"]
			}
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload("public"),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
					stdio: ["ignore", "inherit", "inherit"],
					shell: true
				});
			}
		}
	};
}
