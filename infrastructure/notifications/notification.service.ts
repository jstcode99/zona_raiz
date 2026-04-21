import { EnquiryEntity } from "@/domain/entities/enquiry.entity";

export type NotificationType =
  | "enquiry_assigned"
  | "enquiry_status_changed"
  | "enquiry_new";

export interface EnquiryNotificationData {
  type: NotificationType;
  enquiry: EnquiryEntity;
  agentEmail: string;
  agentName: string;
  oldStatus?: string;
  newStatus?: string;
  listingTitle?: string;
  leadName?: string;
}

export class NotificationService {
  /**
   * Envía notificación cuando una consulta se asigna a un agente
   */
  async enquiryAssigned(data: EnquiryNotificationData): Promise<void> {
    const { agentEmail, agentName, enquiry, listingTitle, leadName } = data;

    // En desarrollo: log a consola
    // En producción: integrar con Resend/SendGrid
    console.log(`
📬 Notificación: Nueva consulta asignada
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Destinatario: ${agentName} (${agentEmail})
Lead: ${leadName || "Sin nombre"}
Propiedad: ${listingTitle || "Sin propiedad"}
Mensaje: ${enquiry.message || "Sin mensaje"}
Estado: ${enquiry.status}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    // TODO: Implementar integración con email provider
    // Ejemplo con Resend:
    // await resend.emails.send({
    //   from: 'notificaciones@krowen.com',
    //   to: agentEmail,
    //   subject: 'Nueva consulta asignada',
    //   html: `...template...`
    // });
  }

  /**
   * Envía notificación cuando cambia el estado de una consulta
   */
  async enquiryStatusChanged(data: EnquiryNotificationData): Promise<void> {
    const {
      agentEmail,
      agentName,
      enquiry,
      oldStatus,
      newStatus,
      listingTitle,
    } = data;

    // Solo notificar si hay un agente asignado
    if (!agentEmail) return;

    console.log(`
📬 Notificación: Estado de consulta actualizado
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Destinatario: ${agentName} (${agentEmail})
Propiedad: ${listingTitle || "Sin propiedad"}
Estado anterior: ${oldStatus}
Estado nuevo: ${newStatus}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  /**
   * Envía notificación cuando se crea una nueva consulta
   * (Para admins/coordinadores de la inmobiliaria)
   */
  async enquiryCreated(data: EnquiryNotificationData): Promise<void> {
    const { enquiry, listingTitle, leadName } = data;

    console.log(`
📬 Notificación: Nueva consulta recibida
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lead: ${leadName || "Sin nombre"}
Email: ${enquiry.email || "No proporcionado"}
Teléfono: ${enquiry.phone || "No proporcionado"}
Propiedad: ${listingTitle || "Sin propiedad"}
Fuente: ${enquiry.source}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }
}

export const notificationService = new NotificationService();