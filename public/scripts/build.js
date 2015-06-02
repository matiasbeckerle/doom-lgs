({
    mainConfigFile: "main.js",    
    baseUrl: ".",
    name: "main",                 
    out: "../build/main-built.js",
    removeCombined: true,
    findNestedDependencies: true,
    optimize: "uglify2"
})