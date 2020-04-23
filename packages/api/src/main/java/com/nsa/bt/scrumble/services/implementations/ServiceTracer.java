package com.nsa.bt.scrumble.services.implementations;

import io.jaegertracing.Configuration;
import io.jaegertracing.internal.JaegerTracer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public final class ServiceTracer {

    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceTracer.class);
    private ServiceTracer() {
    }

    @Value("${ryans.hopes.and.dreams}")
    private String agentHost;

    public JaegerTracer getTracer() {
        LOGGER.info(String.format("Ryans hopes and dreams: %s", agentHost));
        Configuration.SamplerConfiguration samplerConfig = Configuration.SamplerConfiguration.fromEnv().withType("const").withParam(1);
        Configuration.SenderConfiguration senderConfiguration = Configuration.SenderConfiguration.fromEnv().withAgentHost(agentHost).withAgentPort(6831);
        Configuration.ReporterConfiguration reporterConfig = Configuration.ReporterConfiguration.fromEnv().withLogSpans(true).withSender(senderConfiguration);
        Configuration config = new Configuration("service").withSampler(samplerConfig).withReporter(reporterConfig);
        return config.getTracer();
    }
}
