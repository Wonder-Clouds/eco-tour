import { ChildEntity, OneToMany } from 'typeorm';
import { Service } from './service.entity';
import { ServiceType } from '../../shared/enums/ServiceType';
import { TransportOption } from '../../transport/entities/transport-option.entity';
import { TouristTicket } from '../../ticket/entities/tourist-ticket.entity';

@ChildEntity()
export class PrivateService extends Service {
  @OneToMany(() => TransportOption, 'service', {
    cascade: true,
    eager: true,
  })
  transportOptions: TransportOption[];

  @OneToMany(() => TouristTicket, 'service', {
    cascade: true,
    eager: true,
  })
  touristTickets: TouristTicket[];

  constructor() {
    super();
    this.serviceType = ServiceType.FORMULA_PRIVATE;
  }

  calculatePrice(
    participants: number,
    options?: {
      students?: number;
      children?: number;
      nationals?: number;
    },
  ): Promise<number> {
    // Seleccionar transporte apropiado
    const transport = this.selectTransportOption(participants);

    // Costos fijos (transporte, guía) divididos entre participantes
    const fixedCosts =
      (transport.cost + (this.feeSupplier || 0)) / participants;

    // Costos individuales (tickets, comidas)
    const individualCosts = this.calculateIndividualCosts(
      participants,
      options,
    );

    const totalPerPerson = fixedCosts + individualCosts;
    const totalAmount = totalPerPerson * participants;

    const finalPrice = this.applyProfitAndCommission(
      totalAmount,
      this.commissionByService || 0,
      this.commissionCard || 0,
    );

    return Promise.resolve(finalPrice);
  }

  private selectTransportOption(participants: number): TransportOption {
    if (!this.transportOptions || this.transportOptions.length === 0) {
      // Retorna un transporte por defecto si no hay opciones
      return {
        cost: 0,
        minPeople: 1,
        maxPeople: 100,
      } as TransportOption;
    }

    const suitableOption = this.transportOptions.find(
      (option) =>
        option.minPeople <= participants && participants <= option.maxPeople,
    );

    return (
      suitableOption ||
      this.transportOptions.reduce((prev, current) =>
        current.maxPeople > prev.maxPeople ? current : prev,
      )
    );
  }

  private calculateIndividualCosts(
    participants: number,
    options?: {
      students?: number;
      children?: number;
      nationals?: number;
    },
  ): number {
    if (!this.touristTickets || this.touristTickets.length === 0) {
      return 0;
    }

    let totalIndividual = 0;

    for (const ticket of this.touristTickets) {
      const ticketCost = ticket.calculateCost(
        participants,
        options?.students || 0,
        options?.children || 0,
        options?.nationals || 0,
      );
      totalIndividual += ticketCost;
    }

    return totalIndividual;
  }
}
