package com.nsa.bt.scrumble.controllers.api.v1;

import io.jaegertracing.Configuration;
import io.jaegertracing.internal.JaegerTracer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public final class ApiTracer {
    private ApiTracer() {
    }

    @Value("${ryans.hopes.and.dreams}")
    private String agentHost;

    public JaegerTracer getTracer() {
        Configuration.SamplerConfiguration samplerConfig = Configuration.SamplerConfiguration.fromEnv().withType("const").withParam(1);
        Configuration.SenderConfiguration senderConfiguration = Configuration.SenderConfiguration.fromEnv().withAgentHost(agentHost).withAgentPort(6831);
        Configuration.ReporterConfiguration reporterConfig = Configuration.ReporterConfiguration.fromEnv().withLogSpans(true).withSender(senderConfiguration);
        Configuration config = new Configuration("controller").withSampler(samplerConfig).withReporter(reporterConfig);
        return config.getTracer();
    }
}
