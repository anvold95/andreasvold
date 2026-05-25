module.exports = function(eleventyConfig) {
  // Pass-through copies (files Eleventy doesn't process, just copies as-is)
  eleventyConfig.addPassthroughCopy("src/site.css");
  eleventyConfig.addPassthroughCopy("src/cursor.js");
  eleventyConfig.addPassthroughCopy("src/strip.js");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy({ "src/favicon.png": "favicon.png" });

  // Watch the CSS so dev server reloads on changes
  eleventyConfig.addWatchTarget("src/site.css");

  // Filters
  eleventyConfig.addFilter("year", (d) => new Date(d).getFullYear());
  eleventyConfig.addFilter("dateISO", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("byYearDesc", (arr) =>
    [...arr].sort((a, b) => {
      const ay = (a.data?.year || "").toString();
      const by = (b.data?.year || "").toString();
      return by.localeCompare(ay);
    })
  );

  // Projects collection — anything in src/projects/*.md
  eleventyConfig.addCollection("projects", (api) =>
    api.getFilteredByGlob("src/projects/*.md")
       .sort((a, b) => {
         const ay = (a.data.sort_year || a.data.year || "").toString();
         const by = (b.data.sort_year || b.data.year || "").toString();
         return by.localeCompare(ay);
       })
  );

  // Writing collection — anything in src/writing-entries/*.md
  eleventyConfig.addCollection("writing", (api) =>
    api.getFilteredByGlob("src/writing-entries/*.md")
       .sort((a, b) => {
         const ay = (a.data.sort_year || a.data.year || "").toString();
         const by = (b.data.sort_year || b.data.year || "").toString();
         return by.localeCompare(ay);
       })
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
