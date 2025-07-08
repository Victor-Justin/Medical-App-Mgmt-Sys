import { Request, Response } from "express";
import * as appointmentController from "../../../src/Appointments/appointments.controller";
import * as appointmentService from "../../../src/Appointments/appointments.service";
import * as paymentService from "../../../src/Payments/payments.service";

jest.mock("../../../src/Appointments/appointments.service");
jest.mock("../../../src/Payments/payments.service");

describe("Appointment Controller", () => {
  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createAppointment should create appointment and payment", async () => {
    const mockAppointment = [{ apId: 1, amount: 500, apDate: "2025-07-01" }];
    (appointmentService.createAppointment as jest.Mock).mockResolvedValue(mockAppointment);
    (paymentService.createPayment as jest.Mock).mockResolvedValue({});

    const req = { body: { userId: 1, docId: 2, amount: 500, apDate: "2025-07-01" } } as Request;
    const res = mockRes();

    await appointmentController.createAppointment(req, res);

    expect(appointmentService.createAppointment).toHaveBeenCalled();
    expect(paymentService.createPayment).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockAppointment[0]);
  });

  test("getAllAppointments should return all appointments", async () => {
    const mockAppointments = [{ apId: 1 }, { apId: 2 }];
    (appointmentService.getAllAppointments as jest.Mock).mockResolvedValue(mockAppointments);

    const res = mockRes();
    await appointmentController.getAllAppointments({} as Request, res);

    expect(appointmentService.getAllAppointments).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockAppointments);
  });

  test("getAppointmentById should return appointment if found", async () => {
    const mockAppointment = { apId: 1 };
    (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(mockAppointment);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();
    await appointmentController.getAppointmentById(req, res);

    expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockAppointment);
  });

  test("getAppointmentById should return 404 if not found", async () => {
    (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: "999" } } as unknown as Request;
    const res = mockRes();
    await appointmentController.getAppointmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Appointment not found" });
  });

  test("updateAppointment should update appointment if found", async () => {
    const existingAppointment = { apId: 1, createdOn: "2025-07-01" };
    const updatedAppointment = { apId: 1, status: "updated" };
    (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(existingAppointment);
    (appointmentService.updateAppointment as jest.Mock).mockResolvedValue(updatedAppointment);

    const req = {
      params: { id: "1" },
      body: { status: "updated" },
    } as unknown as Request;
    const res = mockRes();

    await appointmentController.updateAppointment(req, res);

    expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1);
    expect(appointmentService.updateAppointment).toHaveBeenCalledWith(1, expect.objectContaining({
      status: "updated",
      createdOn: existingAppointment.createdOn,
    }));
    expect(res.json).toHaveBeenCalledWith(updatedAppointment);
  });

  test("updateAppointment should return 404 if not found", async () => {
    (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: "999" }, body: {} } as unknown as Request;
    const res = mockRes();

    await appointmentController.updateAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Appointment not found" });
  });

  test("deleteAppointment should delete and return result", async () => {
    const mockDeleted = { apId: 1, deleted: true };
    (appointmentService.deleteAppointment as jest.Mock).mockResolvedValue(mockDeleted);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();

    await appointmentController.deleteAppointment(req, res);

    expect(appointmentService.deleteAppointment).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockDeleted);
  });
});
