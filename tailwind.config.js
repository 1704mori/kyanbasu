/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: "hsl(209 100% 55%)",
				"primary-accent": "hsl(209 100% 50%)",
			}
		}
	},
	plugins: [],
};
