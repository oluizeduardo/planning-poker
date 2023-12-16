import os from 'os';

const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  let ipAddress;

  // Iterate over network interfaces
  Object.keys(interfaces).forEach((interfaceName) => {
    const interfaceInfos = interfaces[interfaceName];

    // Iterate over interface details
    interfaceInfos.forEach((info) => {
      // Check for IPv4 address and not 127.0.0.1 (localhost)
      if (info.family === 'IPv4' && !info.internal) {
        ipAddress = info.address;
      }
    });
  });

  return ipAddress;
};

export default getLocalIPAddress;
