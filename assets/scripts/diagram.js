var highlight = function(node) {
    console.log(node);
    $(".text").toggleClass('mermaidClick');
}

var config = {
    startOnLoad: true,
    flowchart:{
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'linear',
    },
    securityLevel: 'loose',
};

mermaid.initialize(config);