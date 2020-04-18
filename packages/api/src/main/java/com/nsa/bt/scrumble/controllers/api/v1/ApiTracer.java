package com.nsa.bt.scrumble.controllers.api.v1;

import io.jaegertracing.Configuration;
import io.jaegertracing.internal.JaegerTracer;

public final class ApiTracer {
    private ApiTracer() { }

    public static JaegerTracer getTracer() {
        Configuration.SamplerConfiguration samplerConfig = Configuration.SamplerConfiguration.fromEnv().withType("const").withParam(1);
        Configuration.ReporterConfiguration reporterConfig = Configuration.ReporterConfiguration.fromEnv().withLogSpans(true);
        Configuration config = new Configuration("controller").withSampler(samplerConfig).withReporter(reporterConfig);
        return config.getTracer();
    }
}
