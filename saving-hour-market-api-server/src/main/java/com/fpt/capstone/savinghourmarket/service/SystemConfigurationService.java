package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.SystemStatus;
import com.fpt.capstone.savinghourmarket.entity.Configuration;

import java.io.IOException;
import java.util.Map;

public interface SystemConfigurationService {
    Configuration getConfiguration();

    Configuration updateConfiguration(Configuration configurationUpdateBody) throws IOException;

    Map<String, Integer> updateSystemState(SystemStatus systemState);
}
