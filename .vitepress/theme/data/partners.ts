export interface Partner {
  name: string
  flag: string
  city: string
  role?: string
}

// City keys must match a key in ./europe-map.json's "cities" map (x/y in
// the same projection as landPath). A city missing there is skipped with a
// warning in dev.
export const DIG_PARTNERS: Partner[] = [
  { name: 'Politecnico di Milano', flag: '🇮🇹', city: 'Milano, Italy', role: 'Coordinator' },
  { name: 'Sorbonne Université', flag: '🇫🇷', city: 'Paris, France' },
  { name: 'ETH Zürich', flag: '🇨🇭', city: 'Zürich, Switzerland' },
  { name: 'University of Thessaly', flag: '🇬🇷', city: 'Volos, Greece' },
  { name: 'Politecnico di Torino', flag: '🇮🇹', city: 'Torino, Italy' },
  { name: 'CEA', flag: '🇫🇷', city: 'Paris, France' },
  { name: 'Barcelona Supercomputing Center', flag: '🇪🇸', city: 'Barcelona, Spain' },
  { name: 'CSIC', flag: '🇪🇸', city: 'Madrid, Spain' },
  { name: 'IHP GmbH', flag: '🇩🇪', city: 'Frankfurt (Oder), Germany' },
  { name: 'Munich University of Applied Sciences', flag: '🇩🇪', city: 'Munich, Germany' },
  { name: 'TU Darmstadt', flag: '🇩🇪', city: 'Darmstadt, Germany' },
  { name: 'JMU Würzburg', flag: '🇩🇪', city: 'Würzburg, Germany' },
  { name: 'INESC TEC', flag: '🇵🇹', city: 'Porto, Portugal' },
  { name: 'STMicroelectronics', flag: '🇮🇹', city: 'Agrate Brianza, Italy' },
  { name: 'Resiltech', flag: '🇮🇹', city: 'Cascina, Italy' },
  { name: 'Seamless Waves', flag: '🇫🇷', city: 'Paris, France' },
  { name: 'Kepler', flag: '🇫🇷', city: 'Palaiseau, France' },
  { name: 'YosysHQ', flag: '🇦🇹', city: 'Vienna, Austria' },
  { name: 'JKU Linz', flag: '🇦🇹', city: 'Linz, Austria' },
  { name: 'KTH Royal Institute of Technology', flag: '🇸🇪', city: 'Stockholm, Sweden' },
  { name: 'Qamcom', flag: '🇸🇪', city: 'Gothenburg, Sweden' },
  { name: 'NanoWired', flag: '🇩🇪', city: 'Gernsheim, Germany' },
  { name: 'Joseki Solutions', flag: '🇭🇺', city: 'Budapest, Hungary' },
]

export const PIV_PARTNERS: Partner[] = [
  { name: 'INESC TEC', flag: '🇵🇹', city: 'Porto, Portugal', role: 'Coordinator' },
  { name: 'Munich University of Applied Sciences', flag: '🇩🇪', city: 'Munich, Germany', role: 'Technical Manager' },
  { name: 'ETH Zürich', flag: '🇨🇭', city: 'Zürich, Switzerland' },
  { name: 'Politecnico di Milano', flag: '🇮🇹', city: 'Milano, Italy' },
  { name: 'Politecnico di Torino', flag: '🇮🇹', city: 'Torino, Italy' },
  { name: 'YosysHQ', flag: '🇦🇹', city: 'Vienna, Austria' },
  { name: 'Linköping University', flag: '🇸🇪', city: 'Linköping, Sweden' },
  { name: 'Qamcom', flag: '🇸🇪', city: 'Gothenburg, Sweden' },
  { name: 'BTU Cottbus-Senftenberg', flag: '🇩🇪', city: 'Cottbus, Germany' },
  { name: 'JKU Linz', flag: '🇦🇹', city: 'Linz, Austria' },
  { name: 'Chipmind', flag: '🇨🇭', city: 'Zürich, Switzerland' },
  { name: 'Barcelona Supercomputing Center', flag: '🇪🇸', city: 'Barcelona, Spain' },
  { name: 'Lubis EDA', flag: '🇩🇪', city: 'Kaiserslautern, Germany' },
  { name: 'Infineon Technologies', flag: '🇩🇪', city: 'Neubiberg, Germany' },
  { name: 'CEA', flag: '🇫🇷', city: 'Paris, France' },
  { name: 'Technical University of Denmark', flag: '🇩🇰', city: 'Kongens Lyngby, Denmark' },
  { name: 'Universidad Politécnica de Madrid', flag: '🇪🇸', city: 'Madrid, Spain' },
  { name: 'Synective Labs', flag: '🇸🇪', city: 'Gothenburg, Sweden' },
  { name: 'SyoSil', flag: '🇩🇰', city: 'Taastrup, Denmark' },
  { name: 'E4 Computer Engineering', flag: '🇮🇹', city: 'Scandiano, Italy' },
  { name: 'Universität zu Lübeck', flag: '🇩🇪', city: 'Lübeck, Germany' },
  { name: 'IObundle', flag: '🇵🇹', city: 'Lisboa, Portugal' },
  { name: 'EDALab', flag: '🇮🇹', city: 'Verona, Italy' },
  { name: 'INESC-ID', flag: '🇵🇹', city: 'Lisboa, Portugal' },
]
