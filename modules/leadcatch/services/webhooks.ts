/**
 * Webhook System for Lead Events
 * Manages webhook registration, delivery, and event handling
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';

export interface WebhookConfig {
  url: string;
  events?: string[];
  secret?: string;
}

export interface Webhook {
  id: string;
  userId: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
}

export interface WebhookDeliveryResult {
  webhookId: string;
  success: boolean;
  error?: string;
}

class WebhookManager extends EventEmitter {
  private webhooks: Map<string, Webhook> = new Map();

  constructor() {
    super();
    this.setupEventListeners();
  }

  /**
   * Register a new webhook
   */
  register(userId: string, config: WebhookConfig): Webhook {
    const webhook: Webhook = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      url: config.url,
      events: config.events || ['lead.created', 'lead.updated', 'lead.enriched'],
      secret: config.secret || this.generateSecret(),
      active: true,
      createdAt: new Date().toISOString()
    };

    this.webhooks.set(webhook.id, webhook);
    console.log(`🔗 Webhook registered: ${webhook.id} for events: ${webhook.events.join(', ')}`);

    return webhook;
  }

  /**
   * Remove a webhook
   */
  unregister(webhookId: string): boolean {
    const deleted = this.webhooks.delete(webhookId);
    if (deleted) {
      console.log(`🗑️ Webhook unregistered: ${webhookId}`);
    }
    return deleted;
  }

  /**
   * Get webhooks for a user
   */
  getByUser(userId: string): Webhook[] {
    return Array.from(this.webhooks.values()).filter(w => w.userId === userId);
  }

  /**
   * Get all webhooks
   */
  getAll(): Webhook[] {
    return Array.from(this.webhooks.values());
  }

  /**
   * Get a webhook by ID
   */
  getById(webhookId: string): Webhook | undefined {
    return this.webhooks.get(webhookId);
  }

  /**
   * Update webhook
   */
  update(webhookId: string, updates: Partial<WebhookConfig>): Webhook | null {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook) return null;

    const updated: Webhook = {
      ...webhook,
      url: updates.url || webhook.url,
      events: updates.events || webhook.events,
      secret: updates.secret || webhook.secret
    };

    this.webhooks.set(webhookId, updated);
    return updated;
  }

  /**
   * Toggle webhook active status
   */
  setActive(webhookId: string, active: boolean): boolean {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook) return false;

    webhook.active = active;
    this.webhooks.set(webhookId, webhook);
    return true;
  }

  /**
   * Send webhook payload to registered endpoints
   */
  async sendWebhook(event: string, payload: any): Promise<WebhookDeliveryResult[]> {
    const relevantWebhooks = Array.from(this.webhooks.values())
      .filter(w => w.active && w.events.includes(event));

    if (relevantWebhooks.length === 0) {
      return [];
    }

    console.log(`📤 Sending ${event} webhook to ${relevantWebhooks.length} endpoints`);

    const results = await Promise.allSettled(
      relevantWebhooks.map(webhook => this.deliverPayload(webhook, event, payload))
    );

    return results.map((result, i) => ({
      webhookId: relevantWebhooks[i].id,
      success: result.status === 'fulfilled',
      error: result.status === 'rejected' ? (result.reason?.message || 'Unknown error') : undefined
    }));
  }

  /**
   * Deliver payload to a single webhook with retry
   */
  private async deliverPayload(
    webhook: Webhook,
    event: string,
    payload: any
  ): Promise<{ success: boolean }> {
    const body = {
      event,
      timestamp: new Date().toISOString(),
      data: payload
    };

    const signature = this.generateSignature(body, webhook.secret);

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': event
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`Webhook delivery failed: ${response.status}`);
        }

        console.log(`✅ Webhook delivered: ${webhook.id} -> ${event}`);
        return { success: true };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        const delay = 2000 * Math.pow(2, attempt);
        console.warn(`⚠️ Webhook attempt ${attempt + 1} failed, retrying in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.error(`❌ Webhook delivery failed after ${maxRetries} attempts: ${webhook.id}`);
    throw lastError;
  }

  /**
   * Setup event listeners for lead events
   */
  private setupEventListeners(): void {
    this.on('lead.created', (lead) => this.sendWebhook('lead.created', lead));
    this.on('lead.updated', (lead) => this.sendWebhook('lead.updated', lead));
    this.on('lead.enriched', (lead) => this.sendWebhook('lead.enriched', lead));
    this.on('lead.deleted', (leadId) => this.sendWebhook('lead.deleted', { id: leadId }));
    this.on('lead.scored', (data) => this.sendWebhook('lead.scored', data));
  }

  /**
   * Generate webhook secret
   */
  generateSecret(): string {
    return 'whsec_' + crypto.randomBytes(24).toString('hex');
  }

  /**
   * Generate HMAC signature for payload
   */
  generateSignature(payload: any, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
  }

  /**
   * Verify incoming webhook signature
   */
  verifySignature(payload: any, signature: string, secret: string): boolean {
    const expected = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  }
}

// Export singleton instance
export const webhookManager = new WebhookManager();

// Export class for testing
export { WebhookManager };

// Emit events externally
export function emitLeadEvent(event: string, data: any): void {
  webhookManager.emit(event, data);
}
