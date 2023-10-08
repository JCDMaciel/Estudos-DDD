import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";
import CustomerFactory from "../factory/customer.factory";
import Address from "../value-object/address";
import CustomerChangeAddressEvent from "./customer-change-address.event";

describe("CustomerChangeAddressEvent unit tests", () => {
    let eventDispatcher: EventDispatcher;
    let eventHandler: EnviaConsoleLogHandler;

    beforeEach(() => {
        eventDispatcher = new EventDispatcher();
        eventHandler = new EnviaConsoleLogHandler();
        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);
    });

    it("should register a handler for CustomerChangeAddressEvent", () => {
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toBe(eventHandler);
    });

    it("should notify a customer change address", () => {
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        const address = new Address("street", 1, "zip", "city");
        const customer = CustomerFactory.createWithAddress("Customer", address);
        const customerChangeAddressEvent = new CustomerChangeAddressEvent(customer);

        eventDispatcher.notify(customerChangeAddressEvent);

        expect(spyEventHandler).toHaveBeenCalledWith(customerChangeAddressEvent);
    });

    it("should not notify if no handler is registered", () => {
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.unregister("CustomerChangeAddressEvent", eventHandler);

        const address = new Address("street", 1, "zip", "city");
        const customer = CustomerFactory.createWithAddress("Customer", address);
        const customerChangeAddressEvent = new CustomerChangeAddressEvent(customer);

        eventDispatcher.notify(customerChangeAddressEvent);

        expect(spyEventHandler).not.toHaveBeenCalled();
    });
});
