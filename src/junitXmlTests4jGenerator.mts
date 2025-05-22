// junitXml.tests4j.ts.adligo.org/src/junitXml.mts


/**
 * Copyright 2025 Adligo Inc / Scott Morgan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ApiTrial, I_XmlConverter, TestResult } from '../../tests4ts.ts.adligo.org/src/tests4ts.mjs';


/**
 * Generates JUnit XML format from tests4ts test results
 */
export class JUnitXmlGenerator implements I_XmlConverter {

  /**
   * Bind to test4ts I_XmlConverter
   * @param trial 
   * @returns 
   */
  convertToXml(trial: ApiTrial): string {
    return this.generateXml(trial);
  }

  /**
   * Generate JUnit XML for a single trial
   * @param trial The ApiTrial containing test results
   * @param hostname Optional hostname for the testsuite
   * @returns XML string in JUnit format
   */
  public generateXml(trial: ApiTrial, hostname: string = 'localhost'): string {
    const testResults = trial.getTestResults();
    const testCount = trial.getTestCount();
    const failureCount = trial.getFailureCount();
    const timestamp = new Date().toISOString();
    
    // Calculate total time (using a placeholder since actual time isn't tracked in ApiTrial)
    const totalTime = 0.0; // Placeholder
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<testsuite name="${trial.getName()}" tests="${testCount}" skipped="0" `;
    xml += `failures="${failureCount}" errors="0" timestamp="${timestamp}" `;
    xml += `hostname="${hostname}" time="${totalTime}">\n`;
    xml += `  <properties/>\n`;
    
    // Add testcase elements
    testResults.forEach(result => {
      xml += this.generateTestCaseXml(result);
    });
    
    // Add system output sections
    xml += `  <system-out><![CDATA[]]></system-out>\n`;
    xml += `  <system-err><![CDATA[]]></system-err>\n`;
    xml += `</testsuite>\n`;
    
    return xml;
  }
  
  /**
   * Generate XML for a single test case
   * @param result The test result
   * @returns XML string for the test case
   */
  private generateTestCaseXml(result: TestResult): string {
    const testName = result.getName();
    const className = this.extractClassName(result.getName());
    const time = 0.001; // Placeholder since actual time isn't tracked
    
    let xml = `  <testcase name="${testName}" classname="${className}" time="${time}"`;
    
    if (!result.isPass()) {
      xml += `>\n`;
      xml += `    <failure message="${this.escapeXml(result.getErrorMessage())}" `;
      xml += `type="AssertionError">${this.escapeXml(result.getErrorMessage())}</failure>\n`;
      xml += `  </testcase>\n`;
    } else {
      xml += `/>\n`;
    }
    
    return xml;
  }
  
  /**
   * Extract class name from test name
   * Assumes format like "org.adligo.package.ClassName.testMethod()"
   */
  private extractClassName(testName: string): string {
    // If test name contains a dot, use everything before the last dot
    // Otherwise use the whole name
    const lastDotIndex = testName.lastIndexOf('.');
    if (lastDotIndex > 0) {
      return testName.substring(0, lastDotIndex);
    }
    return testName;
  }
  
  /**
   * Escape special XML characters
   */
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}