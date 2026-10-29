export type ProjectId = 'ams' | 'dig' | 'piv'
export type PartnerType = 'research' | 'university' | 'company'

export interface Partner {
  name: string
  flag: string
  /** map key, see below */
  city: string
  /** shown on the partner card when it differs from `city` */
  location?: string
  type?: PartnerType
  role?: string
  /** work packages the partner leads, e.g. ['WP3', 'WP6'] */
  wps?: string[]
  logo?: string
  url?: string
}

// City keys must match a key in ./europe-map.json's "cities" map (x/y in
// the same projection as landPath). A city missing there is skipped with a
// warning in dev.
const DIG_PARTNERS: Partner[] = [
  { name: 'CEA', flag: '🇫🇷', city: 'Paris, France', type: 'research', logo: '/img/partners/cea.jpg', url: 'https://www.cea.fr' },
  { name: 'Barcelona Supercomputing Center', flag: '🇪🇸', city: 'Barcelona, Spain', type: 'research', logo: '/img/partners/bsc.svg', url: 'https://www.bsc.es' },
  { name: 'CSIC', flag: '🇪🇸', city: 'Madrid, Spain', type: 'research', logo: '/img/partners/csic.svg', url: 'https://www.csic.es' },
  { name: 'IHP GmbH', flag: '🇩🇪', city: 'Frankfurt (Oder), Germany', type: 'research', logo: '/img/partners/ihp.svg', url: 'https://www.ihp-microelectronics.com' },
  { name: 'INESC TEC', flag: '🇵🇹', city: 'Porto, Portugal', type: 'research', logo: '/img/partners/inesc-tec.svg', url: 'https://www.inesctec.pt' },
  { name: 'Politecnico di Milano', flag: '🇮🇹', city: 'Milano, Italy', type: 'university', role: 'Coordinator', logo: '/img/partners/polimi.svg', url: 'https://www.polimi.it' },
  { name: 'Sorbonne Université', flag: '🇫🇷', city: 'Paris, France', type: 'university', logo: '/img/partners/sorbonne.svg', url: 'https://www.sorbonne-universite.fr' },
  { name: 'ETH Zürich', flag: '🇨🇭', city: 'Zürich, Switzerland', type: 'university', logo: '/img/partners/eth.svg', url: 'https://ethz.ch' },
  { name: 'University of Thessaly', flag: '🇬🇷', city: 'Volos, Greece', type: 'university', logo: '/img/partners/uth.png', url: 'https://www.uth.gr' },
  { name: 'Politecnico di Torino', flag: '🇮🇹', city: 'Torino, Italy', type: 'university', logo: '/img/partners/polito.svg', url: 'https://www.polito.it' },
  { name: 'Munich University of Applied Sciences', flag: '🇩🇪', city: 'Munich, Germany', type: 'university', logo: '/img/partners/hm-munich.png', url: 'https://www.hm.edu' },
  { name: 'TU Darmstadt', flag: '🇩🇪', city: 'Darmstadt, Germany', type: 'university', logo: '/img/partners/tu-darmstadt.svg', url: 'https://www.tu-darmstadt.de' },
  { name: 'JMU Würzburg', flag: '🇩🇪', city: 'Würzburg, Germany', type: 'university', logo: '/img/partners/jmu.svg', url: 'https://www.uni-wuerzburg.de' },
  { name: 'JKU Linz', flag: '🇦🇹', city: 'Linz, Austria', type: 'university', logo: '/img/partners/jku.svg', url: 'https://www.jku.at' },
  { name: 'KTH Royal Institute of Technology', flag: '🇸🇪', city: 'Stockholm, Sweden', type: 'university', logo: '/img/partners/kth.svg', url: 'https://www.kth.se' },
  { name: 'STMicroelectronics', flag: '🇮🇹', city: 'Agrate Brianza, Italy', type: 'company', logo: '/img/partners/st.svg', url: 'https://www.st.com' },
  { name: 'Resiltech', flag: '🇮🇹', city: 'Cascina, Italy', type: 'company', logo: '/img/partners/resiltech.png' },
  { name: 'Seamless Waves', flag: '🇫🇷', city: 'Paris, France', type: 'company', logo: '/img/partners/seamlesswaves.png' },
  { name: 'Kepler', flag: '🇫🇷', city: 'Palaiseau, France', type: 'company' },
  { name: 'YosysHQ', flag: '🇦🇹', city: 'Vienna, Austria', type: 'company', logo: '/img/partners/yosyshq.png', url: 'https://www.yosyshq.com' },
  { name: 'Qamcom', flag: '🇸🇪', city: 'Gothenburg, Sweden', type: 'company', logo: '/img/partners/qamcom.svg', url: 'https://www.qamcom.com' },
  { name: 'NanoWired', flag: '🇩🇪', city: 'Gernsheim, Germany', type: 'company', logo: '/img/partners/nanowired.svg' },
  { name: 'Joseki Solutions', flag: '🇭🇺', city: 'Budapest, Hungary', type: 'company', logo: '/img/partners/joseki.svg' },
]

const PIV_PARTNERS: Partner[] = [
  { name: 'INESC TEC', flag: '🇵🇹', city: 'Porto, Portugal', type: 'research', role: 'Coordinator', wps: ['WP6'], logo: '/img/partners/inesc-tec.svg', url: 'https://www.inesctec.pt' },
  { name: 'Barcelona Supercomputing Center', flag: '🇪🇸', city: 'Barcelona, Spain', type: 'research', wps: ['WP3'], logo: '/img/partners/bsc.svg', url: 'https://www.bsc.es' },
  { name: 'CEA', flag: '🇫🇷', city: 'Paris, France', type: 'research', logo: '/img/partners/cea.jpg', url: 'https://www.cea.fr' },
  { name: 'INESC-ID', flag: '🇵🇹', city: 'Lisboa, Portugal', type: 'research', logo: '/img/partners/inesc-id.svg', url: 'https://www.inesc-id.pt' },
  { name: 'Munich University of Applied Sciences', flag: '🇩🇪', city: 'Munich, Germany', location: 'München, Germany', type: 'university', role: 'Technical Manager', wps: ['WP2'], logo: '/img/partners/hm-munich.png', url: 'https://www.hm.edu' },
  { name: 'ETH Zürich', flag: '🇨🇭', city: 'Zürich, Switzerland', type: 'university', logo: '/img/partners/eth.svg', url: 'https://ethz.ch' },
  { name: 'Politecnico di Milano', flag: '🇮🇹', city: 'Milano, Italy', type: 'university', wps: ['WP5'], logo: '/img/partners/polimi.svg', url: 'https://www.polimi.it' },
  { name: 'Politecnico di Torino', flag: '🇮🇹', city: 'Torino, Italy', type: 'university', wps: ['WP4'], logo: '/img/partners/polito.svg', url: 'https://www.polito.it' },
  { name: 'Linköping University', flag: '🇸🇪', city: 'Linköping, Sweden', type: 'university', logo: '/img/partners/liu.svg', url: 'https://liu.se' },
  { name: 'BTU Cottbus-Senftenberg', flag: '🇩🇪', city: 'Cottbus, Germany', type: 'university', url: 'https://www.b-tu.de' },
  { name: 'JKU Linz', flag: '🇦🇹', city: 'Linz, Austria', type: 'university', logo: '/img/partners/jku.svg', url: 'https://www.jku.at' },
  { name: 'Technical University of Denmark', flag: '🇩🇰', city: 'Kongens Lyngby, Denmark', type: 'university', logo: '/img/partners/dtu.svg', url: 'https://www.dtu.dk' },
  { name: 'Universidad Politécnica de Madrid', flag: '🇪🇸', city: 'Madrid, Spain', type: 'university', logo: '/img/partners/upm.svg', url: 'https://www.upm.es' },
  { name: 'Universität zu Lübeck', flag: '🇩🇪', city: 'Lübeck, Germany', type: 'university', logo: '/img/partners/uzl.svg', url: 'https://www.uni-luebeck.de' },
  { name: 'YosysHQ', flag: '🇦🇹', city: 'Vienna, Austria', location: 'Wien, Austria', type: 'company', logo: '/img/partners/yosyshq.png', url: 'https://www.yosyshq.com' },
  { name: 'Qamcom', flag: '🇸🇪', city: 'Gothenburg, Sweden', location: 'Göteborg, Sweden', type: 'company', logo: '/img/partners/qamcom.svg', url: 'https://www.qamcom.com' },
  { name: 'Chipmind', flag: '🇨🇭', city: 'Zürich, Switzerland', type: 'company', logo: '/img/partners/chmd.png', url: 'https://www.chipmind.ai' },
  { name: 'Lubis EDA', flag: '🇩🇪', city: 'Kaiserslautern, Germany', type: 'company', logo: '/img/partners/leda.png', url: 'https://lubis-eda.com' },
  { name: 'Infineon Technologies', flag: '🇩🇪', city: 'Neubiberg, Germany', type: 'company', logo: '/img/partners/ifag.svg', url: 'https://www.infineon.com' },
  { name: 'Synective Labs', flag: '🇸🇪', city: 'Gothenburg, Sweden', location: 'Göteborg, Sweden', type: 'company', logo: '/img/partners/sl-dark.png', url: 'https://www.synective.se' },
  { name: 'SyoSil', flag: '🇩🇰', city: 'Taastrup, Denmark', type: 'company', logo: '/img/partners/syo.png', url: 'https://www.syosil.com' },
  { name: 'E4 Computer Engineering', flag: '🇮🇹', city: 'Scandiano, Italy', type: 'company', wps: ['WP1'], logo: '/img/partners/e4.png', url: 'https://www.e4company.com' },
  { name: 'IObundle', flag: '🇵🇹', city: 'Lisboa, Portugal', type: 'company', logo: '/img/partners/iob.png', url: 'https://www.iobundle.com' },
  { name: 'EDALab', flag: '🇮🇹', city: 'Verona, Italy', type: 'company', logo: '/img/partners/edalab.png', url: 'https://www.edalab.it' },
]

const AMS_PARTNERS: Partner[] = [
  { name: 'IHP', flag: '🇩🇪', city: 'Frankfurt (Oder), Germany', type: 'research', role: 'Coordinator', wps: ['WP3', 'WP6', 'WP7'], logo: '/img/partners/ihp.svg', url: 'https://www.ihp-microelectronics.com' },
  { name: 'Silicon Austria Labs', flag: '🇦🇹', city: 'Graz, Austria', type: 'research', logo: '/img/partners/sal.svg', url: 'https://silicon-austria-labs.com' },
  { name: 'CSIC', flag: '🇪🇸', city: 'Seville, Spain', type: 'research', logo: '/img/partners/csic.svg', url: 'https://www.csic.es' },
  { name: 'Fraunhofer IIS', flag: '🇩🇪', city: 'Dresden, Germany', type: 'research', logo: '/img/partners/fraunhofer-iis.svg', url: 'https://www.eas.iis.fraunhofer.de' },
  { name: 'CSC – IT Center for Science', flag: '🇫🇮', city: 'Espoo, Finland', type: 'research', logo: '/img/partners/csc.svg', url: 'https://www.csc.fi' },
  { name: 'Barcelona Supercomputing Center', flag: '🇪🇸', city: 'Barcelona, Spain', type: 'research', logo: '/img/partners/bsc.svg', url: 'https://www.bsc.es' },
  { name: 'ETH Zürich', flag: '🇨🇭', city: 'Zürich, Switzerland', type: 'university', logo: '/img/partners/eth.svg', url: 'https://ethz.ch' },
  { name: 'Universidad de Sevilla', flag: '🇪🇸', city: 'Seville, Spain', location: 'Seville, Spain — affiliated entity of CSIC', type: 'university', logo: '/img/partners/us.png', url: 'https://www.us.es' },
  { name: 'University of Ljubljana', flag: '🇸🇮', city: 'Ljubljana, Slovenia', type: 'university', logo: '/img/partners/ul.png', url: 'https://www.fe.uni-lj.si' },
  { name: 'Aalto University', flag: '🇫🇮', city: 'Espoo, Finland', type: 'university', logo: '/img/partners/aalto.png', url: 'https://www.aalto.fi' },
  { name: 'University of Duisburg-Essen', flag: '🇩🇪', city: 'Duisburg, Germany', type: 'university', wps: ['WP1'], logo: '/img/partners/ude.svg', url: 'https://www.uni-due.de' },
  { name: 'JKU Linz', flag: '🇦🇹', city: 'Linz, Austria', type: 'university', logo: '/img/partners/jku.svg', url: 'https://www.jku.at' },
  { name: 'University of Southern Denmark', flag: '🇩🇰', city: 'Odense, Denmark', type: 'university', wps: ['WP5'], logo: '/img/partners/sdu.svg', url: 'https://www.sdu.dk' },
  { name: 'University of Thessaly', flag: '🇬🇷', city: 'Volos, Greece', type: 'university', logo: '/img/partners/uth.png', url: 'https://www.uth.gr' },
  { name: 'Sorbonne Université', flag: '🇫🇷', city: 'Paris, France', type: 'university', logo: '/img/partners/sorbonne.svg', url: 'https://www.sorbonne-universite.fr' },
  { name: 'Infineon Technologies Austria', flag: '🇦🇹', city: 'Villach, Austria', type: 'company', wps: ['WP2'], logo: '/img/partners/ifag.svg', url: 'https://www.infineon.com' },
  { name: 'Infineon Technologies', flag: '🇩🇪', city: 'Neubiberg, Germany', type: 'company', logo: '/img/partners/ifag.svg', url: 'https://www.infineon.com' },
  { name: 'IMST', flag: '🇩🇪', city: 'Kamp-Lintfort, Germany', type: 'company', wps: ['WP4'], logo: '/img/partners/imst.png', url: 'https://www.imst.de' },
  { name: 'GMC Consulting', flag: '🇨🇭', city: 'Commugny, Switzerland', type: 'company', logo: '/img/partners/gmc.svg' },
  { name: 'Kovilta', flag: '🇫🇮', city: 'Turku, Finland', type: 'company', logo: '/img/partners/kovilta.png', url: 'https://www.kovilta.fi' },
  { name: 'Saab Finland', flag: '🇫🇮', city: 'Tampere, Finland', type: 'company', logo: '/img/partners/saab.svg', url: 'https://www.saab.com' },
  { name: 'IQM Quantum Computers', flag: '🇫🇮', city: 'Espoo, Finland', type: 'company', logo: '/img/partners/iqm.svg', url: 'https://meetiqm.com' },
  { name: 'Lime Microsystems', flag: '🇱🇹', city: 'Vilnius, Lithuania', type: 'company', logo: '/img/partners/lime.svg', url: 'https://limemicro.com' },
  // city unknown: pinned in the middle of the country
  { name: 'SensifAI Edge', flag: '🇩🇰', city: 'Denmark', type: 'company', logo: '/img/partners/sensifai.svg', url: 'https://sensifai.io' },
  { name: 'Pragmatic Semiconductor', flag: '🇬🇧', city: 'Cambridge, United Kingdom', type: 'company', logo: '/img/partners/pragmatic.png', url: 'https://www.pragmaticsemi.com' },
  { name: 'FibraServi', flag: '🇧🇪', city: 'Heist-op-den-Berg, Belgium', type: 'company', logo: '/img/partners/fibraservi.svg' },
]

export const PARTNERS: Record<ProjectId, Partner[]> = { ams: AMS_PARTNERS, dig: DIG_PARTNERS, piv: PIV_PARTNERS }

/** Counts shown on a project's partners page, all derived from its list. */
export function partnerStats(project: ProjectId) {
  const list = PARTNERS[project]
  const count = (type: PartnerType) => list.filter((p) => p.type === type).length
  return {
    organisations: list.length,
    countries: new Set(list.map((p) => p.flag)).size,
    universities: count('university'),
    research: count('research'),
    companies: count('company'),
  }
}
