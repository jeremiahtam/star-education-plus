
import { SiMicrosoftoffice } from 'react-icons/si';
import { BiGasPump } from 'react-icons/bi'
import { MdElectricBolt } from 'react-icons/md';
import { AiTwotoneInsurance } from 'react-icons/ai';
import { BsPrinterFill, BsVectorPen } from 'react-icons/bs';

const serviceProvidersList = [
  { name: "Gas", icon: BiGasPump, iconColor: '#a90c45' },
  { name: "Electric", icon: MdElectricBolt, iconColor: '#301aaf' },
  { name: "Insurance", icon: AiTwotoneInsurance, iconColor: '#aa8302' },
  { name: "Office 360", icon: SiMicrosoftoffice, iconColor: '#1d698c' },
  { name: "Smartboards and printers", icon: BsPrinterFill, iconColor: '#1d698c' },
  { name: "School Management System", icon: BsPrinterFill, iconColor: '#1d698c' },
  { name: "Technology Filtering and Monitoring", icon: BsPrinterFill, iconColor: '#1d698c' },
  { name: "Stationary", icon: BsVectorPen, iconColor: '#301aaf' }
]

export default serviceProvidersList