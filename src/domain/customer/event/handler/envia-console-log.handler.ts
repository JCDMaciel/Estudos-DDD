import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerChangeAddressEvent> {
    handle(event: CustomerChangeAddressEvent): void {
        const { customerId, customerName, newAddress } = event.eventData;

        console.log(`Endereço do cliente ${customerId}, ${customerName} alterado para: ${newAddress}`);
    }
}
