import { NextResponse } from "next/server";

interface ConnectionTest {
  status?: number;
  statusText?: string;
  ok?: boolean;
  headers?: { [key: string]: string };
  dataSample?: any;
  errorResponse?: string;
  error?: string;
  type?: string;
}

interface Validation {
  exists: boolean;
  length: number;
  prefix: string;
  suffix: string;
  format: string;
}

export async function GET() {
  try {
    const apiKey = process.env.OPENSEA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OpenSea API key not configured",
          message: "Please set OPENSEA_API_KEY in your environment variables",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    // At this point, apiKey is guaranteed to be defined

    // Basic API key validation
    const validation: Validation = {
      exists: !!apiKey,
      length: apiKey!.length,
      prefix: apiKey!.substring(0, 8) + "...",
      suffix: "..." + apiKey!.substring(apiKey!.length - 4),
      format: apiKey!.startsWith("2") ? "Valid format (starts with 2)" : "Unexpected format",
    };

    // Test with a simple OpenSea endpoint
    let connectionTest: ConnectionTest | null = null;
    try {
      const response = await fetch("https://api.opensea.io/api/v2/collections", {
        headers: {
          "X-API-KEY": apiKey!,
          Accept: "application/json",
        },
      });

      connectionTest = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      };

      if (response.ok) {
        try {
          const data = await response.json();
          connectionTest.dataSample = data.collections ? data.collections.slice(0, 2) : "No collections data";
        } catch {
          connectionTest.dataSample = "Could not parse response data";
        }
      } else {
        try {
          const errorText = await response.text();
          connectionTest.errorResponse = errorText;
        } catch {
          connectionTest.errorResponse = "Could not read error response";
        }
      }
    } catch (error) {
      connectionTest = {
        error: error instanceof Error ? error.message : "Unknown error",
        type: "Network or fetch error",
      };
    }

    return NextResponse.json({
      success: true,
      message: "API key validation completed",
      validation,
      connectionTest,
      recommendations: getRecommendations(validation, connectionTest),
    });
  } catch (error) {
    console.error("API key validation failed:", error);

    return NextResponse.json(
      {
        error: "API key validation failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

function getRecommendations(validation: Validation, connectionTest: ConnectionTest | null): string[] {
  const recommendations = [];

  if (!validation.exists) {
    recommendations.push("Set OPENSEA_API_KEY environment variable");
  }

  if (validation.length < 20) {
    recommendations.push("API key seems too short - typical OpenSea API keys are longer");
  }

  if (validation.length > 100) {
    recommendations.push("API key seems too long - check if you copied it correctly");
  }

  if (connectionTest?.status === 401) {
    recommendations.push("API key is invalid or expired - get a new one from OpenSea");
  }

  if (connectionTest?.status === 403) {
    recommendations.push("API key lacks required permissions - check your OpenSea account settings");
  }

  if (connectionTest?.status === 429) {
    recommendations.push("Rate limit exceeded - wait a moment and try again");
  }

  if (connectionTest?.error) {
    recommendations.push("Network error - check your internet connection and try again");
  }

  if (recommendations.length === 0) {
    recommendations.push("API key appears to be working correctly!");
  }

  return recommendations;
}
