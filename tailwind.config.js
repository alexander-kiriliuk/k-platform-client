/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: "",
	content: [
		"./src/**/*.{html,ts}",
	],
	theme: {
		extend: {
      screens: {
        "2xs": "370px",
        xs: "412px",
        sm: "640px",
        md: "768px",
        lg: "1025px",
        xl: "1280px",
        "max-xl": [
          {
            max: "1280px"
          }
        ],
        "max-lg": [
          {
            max: "1025px"
          }
        ],
        "max-md": [
          {
            max: "768px"
          }
        ],
        "max-sm": [
          {
            max: "640px"
          }
        ],
        "max-2xs": [
          {
            max: "370px"
          }
        ]
      },
    },
	},
	plugins: [
		require("postcss-import"),
		require("autoprefixer"),
		require("tailwindcss-animated")
	],
};
