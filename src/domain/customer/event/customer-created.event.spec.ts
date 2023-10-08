import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "./customer-created.event";

describe("CustomerCreatedEvent unit tests", () => {
    let eventDispatcher: EventDispatcher;
    let eventHandler1: EnviaConsoleLog1Handler;
    let eventHandler2: EnviaConsoleLog2Handler;

    beforeEach(() => {
        eventDispatcher = new EventDispatcher();
        eventHandler1 = new EnviaConsoleLog1Handler();
        eventHandler2 = new EnviaConsoleLog2Handler();
        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    });

    it("should register event handlers", () => {
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toContain(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toContain(eventHandler2);
    });

    it("should notify all event handlers", () => {
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        const customer = new Customer("1", "Customer");
        const customerCreatedEvent = new CustomerCreatedEvent(customer);

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalledWith(customerCreatedEvent);
        expect(spyEventHandler2).toHaveBeenCalledWith(customerCreatedEvent);
    });
});
