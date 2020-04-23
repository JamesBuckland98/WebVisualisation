package com.nsa.bt.scrumble.services.implementations;

import io.jaegertracing.Configuration;
import io.jaegertracing.internal.JaegerTracer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public final class ServiceTracer {
    private ServiceTracer() {
    }

    @Value("${ryans.hopes.and.dreams}")
    private String agentHost;

    public JaegerTracer getTracer() {
        System.out.println("====================BITCHES==================== " + agentHost);
        Configuration.SamplerConfiguration samplerConfig = Configuration.SamplerConfiguration.fromEnv().withType("const").withParam(1);
        Configuration.SenderConfiguration senderConfiguration = Configuration.SenderConfiguration.fromEnv().withAgentHost(agentHost).withAgentPort(6831);
        Configuration.ReporterConfiguration reporterConfig = Configuration.ReporterConfiguration.fromEnv().withLogSpans(true).withSender(senderConfiguration);
        Configuration config = new Configuration("service").withSampler(samplerConfig).withReporter(reporterConfig);
        return config.getTracer();
    }
}
