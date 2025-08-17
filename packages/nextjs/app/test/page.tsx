"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function TestPage() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testOpenSeaConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/test/opensea-connection");
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to test OpenSea connection");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const validateAPIKey = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/test/validate-api-key");
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        // Update the API key status in debug info
        updateAPIKeyStatus(data.validation?.exists || false);
      } else {
        setError(data.error || "Failed to validate API key");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAPIKeyStatus = (exists: boolean) => {
    const statusElement = document.getElementById("api-key-status");
    if (statusElement) {
      statusElement.innerHTML = exists ? "✅ Configured" : "❌ Not Set";
    }
  };

  // Check API key status on component mount
  useEffect(() => {
    const checkAPIKeyStatus = async () => {
      try {
        const response = await fetch("/api/test/api-key-status");
        if (response.ok) {
          const data = await response.json();
          updateAPIKeyStatus(data.status?.exists || false);
        }
      } catch {
        // Silently fail on mount
      }
    };

    checkAPIKeyStatus();
  }, []);

  const testCollectionStats = async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/test/collection-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contractAddress: address }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to get collection stats");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const testNFTCreation = async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/test/create-test-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorAddress: address,
          name: "Test NFT from Donattelo",
          description: "This is a test NFT created through the Donattelo OpenSea integration",
          imageUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Test+NFT",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to create test NFT");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">🧪 Donattelo OpenSea Integration Test</h1>

        <div className="bg-base-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="text-lg mb-4">
            This is a test environment for integrating OpenSea APIs with Donattelo. The goal is to create NFTs through
            an AI agent and list them for sale on OpenSea.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-base-100 p-4 rounded-lg">
              <h3 className="font-semibold text-primary">🎨 AI Agent</h3>
              <p>Intelligent NFT creation and analysis</p>
            </div>
            <div className="bg-base-100 p-4 rounded-lg">
              <h3 className="font-semibold text-primary">🔗 OpenSea Integration</h3>
              <p>Seamless marketplace listing</p>
            </div>
            <div className="bg-base-100 p-4 rounded-lg">
              <h3 className="font-semibold text-primary">⚡ Automated Workflow</h3>
              <p>From creation to sale in one flow</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* OpenSea Connection Test */}
          <div className="bg-base-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-primary">🔌 Test OpenSea Connection</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Verify that the OpenSea API integration is working correctly
            </p>
            <div className="space-y-2">
              <button onClick={testOpenSeaConnection} disabled={isLoading} className="btn btn-primary w-full">
                {isLoading ? "Testing..." : "Test Connection"}
              </button>
              <button onClick={validateAPIKey} disabled={isLoading} className="btn btn-outline btn-primary w-full">
                {isLoading ? "Validating..." : "🔑 Validate API Key"}
              </button>
            </div>
          </div>

          {/* Collection Stats Test */}
          <div className="bg-base-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-primary">📊 Test Collection Stats</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Get collection statistics from OpenSea (requires connected wallet)
            </p>
            <button
              onClick={testCollectionStats}
              disabled={isLoading || !isConnected}
              className="btn btn-secondary w-full"
            >
              {isLoading ? "Loading..." : "Get Collection Stats"}
            </button>
          </div>

          {/* NFT Creation Test */}
          <div className="bg-base-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-primary">🎨 Test NFT Creation</h3>
            <p className="text-sm text-base-content/70 mb-4">Create a test NFT and prepare it for OpenSea listing</p>
            <button onClick={testNFTCreation} disabled={isLoading || !isConnected} className="btn btn-accent w-full">
              {isLoading ? "Creating..." : "Create Test NFT"}
            </button>
          </div>

          {/* Wallet Status */}
          <div className="bg-base-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-primary">👛 Wallet Status</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Connected:</span>{" "}
                <span className={isConnected ? "text-success" : "text-error"}>{isConnected ? "Yes" : "No"}</span>
              </p>
              {isConnected && (
                <p className="text-sm">
                  <span className="font-medium">Address:</span>{" "}
                  <span className="font-mono text-xs break-all">{address}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className="mt-8 bg-base-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-success">✅ Test Results</h3>
            <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 bg-error/10 border border-error rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-error">❌ Error Occurred</h3>
            <p className="text-error">{error}</p>
          </div>
        )}

        {/* Debug Information */}
        <div className="mt-8 bg-base-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-info">🐛 Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Environment:</strong> {process.env.NODE_ENV || "development"}
              </p>
              <p>
                <strong>API Base:</strong> {process.env.OPENSEA_API_BASE || "https://api.opensea.io/api/v2"}
              </p>
              <p>
                <strong>API Key Status:</strong> <span id="api-key-status">Checking...</span>
              </p>
            </div>
            <div>
              <p>
                <strong>Current Time:</strong> {new Date().toLocaleString()}
              </p>
              <p>
                <strong>Test Route:</strong> /test
              </p>
              <p>
                <strong>API Routes:</strong> /api/test/*
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                const checkAPIKeyStatus = async () => {
                  try {
                    const response = await fetch("/api/test/api-key-status");
                    if (response.ok) {
                      const data = await response.json();
                      updateAPIKeyStatus(data.status?.exists || false);
                    }
                  } catch (err) {
                    console.error("Failed to refresh API key status:", err);
                  }
                };
                checkAPIKeyStatus();
              }}
              className="btn btn-sm btn-outline btn-info"
            >
              🔄 Refresh Status
            </button>
          </div>
        </div>

        {/* Navigation Back */}
        <div className="mt-8 text-center">
          <Link href="/" className="btn btn-outline">
            ← Back to Main App
          </Link>
        </div>
      </div>
    </div>
  );
}
