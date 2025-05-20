import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginFilters from "./_config/filters.js";
import pluginIcons from 'eleventy-plugin-icons';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {

	// Drafts handling (see _data/eleventyDataSchema.js)
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	// Copy files to output directory
	eleventyConfig
		.addPassthroughCopy({"./public/": "/"})
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

	// Watchers
	eleventyConfig.addWatchTarget("css/**/*.css"); // Watch CSS files
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}"); // Images for image pipeline

	// Bundle: {% css %} for <style>, except <style eleventy:ignore>
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		bundleHtmlContentFromSelector: "style",
	});

	// Bundle: {% js %} for <script>, except <script eleventy:ignore>
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
		bundleHtmlContentFromSelector: "script",
	});

	//
	// Official plugins
	//

	// Syntax highlighting: https://www.11ty.dev/docs/plugins/syntaxhighlight/
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});

	// Navigation
	eleventyConfig.addPlugin(pluginNavigation);

	// HTML Base
	eleventyConfig.addPlugin(HtmlBasePlugin);

	// Path to URL
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

	// Feed
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		templateData: {
			// eleventyNavigation: {
			// 	key: "Feed",
			// 	order: 4
			// }
		},
		collection: {
			name: "posts",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "Blog Title",
			subtitle: "This is a longer description about your blog.",
			base: "https://example.com/",
			author: {
				name: "Your Name"
			}
		}
	});

	// Image transforms: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {

		// Output formats for each image.
		formats: ["avif", "webp", "auto"],

		// widths: ["auto"],

		failOnError: false,

		htmlOptions: {
			imgAttributes: {
				// e.g. <img loading decoding> assigned on the HTML tag will override these values.
				loading: "lazy",
				decoding: "async",
			}
		},

		sharpOptions: {
			animated: true,
		},

	});

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	// ID Attribute
	eleventyConfig.addPlugin(IdAttributePlugin, {
		// slugify: eleventyConfig.getFilter("slugify"),  // DEFAULT
		// selector: "h1,h2,h3,h4,h5,h6",  // DEFAULT
	});

	// Icons
	eleventyConfig.addPlugin(pluginIcons, {
		sources: [
			// { name: 'simple', path: 'node_modules/simple-icons/icons', default: true },
			{ name: 'lucide', path: 'node_modules/lucide-static/icons', default: true },
			// { name: 'tabler', path: 'node_modules/@tabler/icons/icons/outline', default: true },
			// { name: 'feather', path: 'node_modules/feather-icons/dist/icons', default: true }
		],
	});

	//
	// Shortcodes
	//

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	//
	// Build optimization
	//

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve
	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

};

export const config = {

	// Control which files Eleventy will process
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],

	// Pre-process *.md files
	markdownTemplateEngine: "njk",

	// Pre-process *.html files
	htmlTemplateEngine: "njk",

	// These are all optional:
	dir: {

		// Site content
		input: "content",

		// Data
		data: "../_data",

		// Includes
		includes: "../_includes",

		// Site output
		output: "docs"

	},

	// For subdirectory deployment (e.g., ~/blog/); pair with `HtmlBasePlugin`
	pathPrefix: "/Tribal-Housing-and-Homelessness-Blog/",

};
