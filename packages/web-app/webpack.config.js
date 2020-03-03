module.exports = {
    // used to disable external files on for amchart4 library
    // https://www.amcharts.com/docs/v4/getting-started/integrations/using-webpack/#Large_file_sizes
    externals(context, request, callback) {
        if (/xlsx|canvg|pdfmake/.test(request)) {
            return callback(null, `commonjs ${request}`);
        }
        callback();
    },
};
