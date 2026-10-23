import React, { useState, useMemo, useEffect } from 'react';
import { Bike, Car, Truck, CheckCircle2 } from 'lucide-react';

import logo from '../assets/logo.png';
import '../styles/paginainicial.css';

type VehicleId = 'carro' | 'moto' | 'caminhao';

type VehicleType = {
  id: VehicleId;
  name: string;
  icon: React.ReactNode;
  description: string;
};

type ServicePackage = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  price: number | null;
  estimatedTime: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
};

type SelectionData = {
  vehicleType: VehicleId;
  package?: ServicePackage;
};

type PaginaInicialProps = {
  onConfirmSelection?: (selectionData: SelectionData) => void;
};

// Categorias de Veículos
const VEHICLE_TYPES: VehicleType[] = [
  {
    id: 'carro',
    name: 'Carros',
    icon: <Car size={26} />,
    description: 'Veículos de passeio e utilitários',
  },
  {
    id: 'moto',
    name: 'Motos',
    icon: <Bike size={26} />,
    description: 'Naked, Custom, Trail e Esportivas',
  },
  {
    id: 'caminhao',
    name: 'Caminhões',
    icon: <Truck size={26} />,
    description: 'Cavalos mecânicos, VUCs e Pesados',
  },
];

// Planos por Categoria
const PACKAGES_BY_VEHICLE: Record<VehicleId, ServicePackage[]> = {
  moto: [
    {
      id: 'SIMPLESMOTO',
      code: 'SIMPLESMOTO',
      title: 'Simples Moto',
      subtitle: 'Lavação essencial, rápida e eficiente',
      price: null,
      estimatedTime: '30 min',
      features: [
        'Lavação com shampoo de pH neutro',
        'Secagem técnica com ar comprimido e microfibra',
        'Limpeza e lubrificação básica da corrente',
        'Aplicação de pretinho especial nos pneus',
      ],
    },
    {
      id: 'DETALHADAMOTO',
      code: 'DETALHADAMOTO',
      title: 'Detalhada Moto',
      subtitle: 'Cuidado aprofundado com desengraxamento',
      price: null,
      estimatedTime: '1h 15min',
      badge: 'Mais Pedido 🔥',
      isPopular: true,
      features: [
        'Tudo do pacote Simples Moto',
        'Desengraxamento técnico da relação e motor',
        'Aplicação de cera protetora na carenagem',
        'Revitalização de plásticos e borracha',
      ],
    },
    {
      id: 'PREMIUMMOTO',
      code: 'PREMIUMMOTO',
      title: 'Premium Moto',
      subtitle: 'Detalhamento estético de alto padrão',
      price: null,
      estimatedTime: '2h 30min',
      badge: 'VIP Showroom ✨',
      features: [
        'Tudo do pacote Detalhada Moto',
        'Polimento técnico e remoção de micro riscos',
        'Proteção cerâmica / Vitrificação da pintura',
        'Polimento e proteção térmica dos escapamentos',
      ],
    },
  ],
  carro: [
    {
      id: 'SIMPLESCARRO',
      code: 'SIMPLESCARRO',
      title: 'Simples Carro',
      subtitle: 'Limpeza rápida e eficiente para o dia a dia',
      price: null,
      estimatedTime: '45 min',
      features: [
        'Ducha com espuma ativa e shampoo neutro',
        'Limpeza externa de vidros e caixas de roda',
        'Secagem com microfibra ultra macia',
        'Aspiração interna dos bancos e carpetes',
      ],
    },
    {
      id: 'DETALHADACARRO',
      code: 'DETALHADACARRO',
      title: 'Detalhada Carro',
      subtitle: 'Limpeza profunda interna e proteção de pintura',
      price: null,
      estimatedTime: '2h 00min',
      badge: 'Mais Popular 🔥',
      isPopular: true,
      features: [
        'Tudo do pacote Simples Carro',
        'Higienização detalhada do painel e plásticos (Proteção UV)',
        'Limpeza técnica de soleiras e canaletas',
        'Aplicação de cera selante com brilho espelhado',
      ],
    },
    {
      id: 'PREMIUMCARRO',
      code: 'PREMIUMCARRO',
      title: 'Premium Carro',
      subtitle: 'Tratamento estético VIP e proteção cerâmica',
      price: null,
      estimatedTime: '4h 00min',
      badge: 'Alta Performance 🛡️',
      features: [
        'Tudo do pacote Detalhada Carro',
        'Descontaminação de pintura e polimento comercial',
        'Higienização a vapor dos estofados ou hidratação de couro',
        'Oxisanitização do sistema de ar-condicionado',
      ],
    },
  ],
  caminhao: [
    {
      id: 'SIMPLESCAMINHAO',
      code: 'SIMPLESCAMINHAO',
      title: 'Simples Caminhão',
      subtitle: 'Lavação externa pesada e cabine rápida',
      price: null,
      estimatedTime: '1h 30min',
      features: [
        'Ducha de alta pressão com shampoo desengraxante',
        'Limpeza externa da cabine, vidros e retrovisores',
        'Lavação de rodas e pneus pesados',
        'Aspiração básica da cabine',
      ],
    },
    {
      id: 'DETALHADACAMINHAO',
      code: 'DETALHADACAMINHAO',
      title: 'Detalhada Caminhão',
      subtitle: 'Higienização da cabine e lavação do chassi',
      price: null,
      estimatedTime: '3h 30min',
      badge: 'Recomendado 🚛',
      isPopular: true,
      features: [
        'Tudo do pacote Simples Caminhão',
        'Lavação detalhada do chassi e suspensão',
        'Higienização interna da cabine e leito',
        'Aplicação de cera protetora na cabine',
      ],
    },
    {
      id: 'PREMIUMCAMINHAO',
      code: 'PREMIUMCAMINHAO',
      title: 'Premium Caminhão',
      subtitle: 'Revitalização completa para frotas e autônomos',
      price: null,
      estimatedTime: '6h 00min',
      badge: 'Frota Premium ✨',
      features: [
        'Tudo do pacote Detalhado Caminhão',
        'Polimento técnico dos tanques de alumínio e rodas',
        'Oxisanitização e higienização a vapor da cabine',
        'Cristalização do para-brisa',
      ],
    },
  ],
};

export default function PaginaInicial({ onConfirmSelection }: PaginaInicialProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleId>('carro');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('DETALHADACARRO');

  // Atualiza o plano padrão ao alterar o tipo de veículo
  useEffect(() => {
    const currentPackages = PACKAGES_BY_VEHICLE[selectedVehicle];
    if (currentPackages.length > 0) {
      const defaultPkg = currentPackages.find((p) => p.isPopular) ?? currentPackages[0];
      setSelectedPackageId(defaultPkg.id);
    }
  }, [selectedVehicle]);

  const availablePackages = useMemo<ServicePackage[]>(
    () => PACKAGES_BY_VEHICLE[selectedVehicle] ?? [],
    [selectedVehicle]
  );

  const currentPackage = useMemo<ServicePackage | undefined>(
    () => availablePackages.find((p) => p.id === selectedPackageId),
    [availablePackages, selectedPackageId]
  );

  const formatPrice = (price: number | null | undefined): string =>
    price === null || price === undefined ? 'A definir' : `R$ ${price}`;

  const handleConfirm = (): void => {
    const selectionData: SelectionData = {
      vehicleType: selectedVehicle,
      package: currentPackage,
    };

    console.log('Dados selecionados para envio ao Backend:', selectionData);

    if (onConfirmSelection) {
      onConfirmSelection(selectionData);
    }
  };

  return (
    <div className="app-root">
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src={logo} alt="Erik Lavajato Logo" />
          <span>Erik Lavajato</span>
        </a>
      </nav>

      {/* ÁREA PRINCIPAL */}
      <section className="service-selector-container">
        <div className="section-header">
          <h2 className="section-title">
            Selecione o <span className="text-highlight">Veículo e o Plano</span>
          </h2>
          <p className="section-subtitle">
            Escolha o tipo do veículo e o nível de serviço desejado.
          </p>
        </div>

        {/* 1. SELEÇÃO DE VEÍCULO */}
        <div className="vehicle-selector-block">
          <label className="block-label">1. Escolha o tipo de veículo:</label>
          <div className="vehicle-grid">
            {VEHICLE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`vehicle-card ${selectedVehicle === type.id ? 'active' : ''}`}
                onClick={() => setSelectedVehicle(type.id)}
              >
                <span className="vehicle-icon">{type.icon}</span>
                <div className="vehicle-text">
                  <span className="vehicle-name">{type.name}</span>
                  <span className="vehicle-desc">{type.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. PLANOS DE SERVIÇO */}
        <div className="packages-grid">
          {availablePackages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`package-card ${isSelected ? 'selected' : ''} ${pkg.isPopular ? 'popular' : ''}`}
                onClick={() => setSelectedPackageId(pkg.id)}
              >
                {pkg.badge && <div className="package-badge">{pkg.badge}</div>}

                <div className="package-header">
                  <div className="package-code-tag">{pkg.code}</div>
                  <h3 className="package-title">{pkg.title}</h3>
                  <p className="package-subtitle">{pkg.subtitle}</p>
                </div>

                <div className="package-price-box">
                  <span className="price-tbd-badge">{formatPrice(pkg.price)}</span>
                  <span className="time-badge">⏱️ {pkg.estimatedTime}</span>
                </div>

                <ul className="package-features">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="check-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button type="button" className={`select-btn ${isSelected ? 'active' : ''}`}>
                  {isSelected ? 'Plano Selecionado' : 'Escolher Plano'}
                </button>
              </div>
            );
          })}
        </div>

        {/* BARRA FIXA INFERIOR DE SELEÇÃO */}
        <div className="summary-bar">
          <div className="summary-details">
            <span className="summary-label">Seleção Atual:</span>
            <div className="summary-price-wrapper">
              <span className="summary-plan-name">{currentPackage?.title}</span>
              <span className="summary-code-badge">[{currentPackage?.code}]</span>
            </div>
          </div>
          <button type="button" className="action-button-primary" onClick={handleConfirm}>
            Confirmar Seleção
          </button>
        </div>
      </section>
    </div>
  );
}