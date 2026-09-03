import os from 'os';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import config from '../config/index.js';
import User from '../models/User.js';
import Branch from '../models/Branch.js';
import Contact from '../models/Contact.js';
import Vehicle from '../models/Vehicle.js';
import Appointment from '../models/Appointment.js';
import Helpdesk from '../models/Helpdesk.js';
import PhoneCall from '../models/PhoneCall.js';

const toMegabytes = (bytes) => Math.round(bytes / 1024 / 1024);

const getSystemStatus = async (req, res) => {
  const startedAt = Date.now();
  let database = {
    status: 'error',
    dialect: config.database.dialect,
    latency_ms: null,
    error: null
  };

  try {
    const databaseStartedAt = Date.now();
    await sequelize.authenticate();
    database = {
      ...database,
      status: 'healthy',
      latency_ms: Date.now() - databaseStartedAt
    };
  } catch (error) {
    database.error = 'Database connection failed';
  }

  const counts = {
    users: 0,
    branches: 0,
    contacts: 0,
    vehicles: 0,
    appointments: 0,
    tickets: 0,
    leads: 0,
    phone_calls: 0,
    today_appointments: 0,
    open_tickets: 0,
    active_vehicles: 0
  };

  if (database.status === 'healthy') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const [users, branches, contacts, vehicles, appointments, tickets, phoneCalls,
      todayAppointments, openTickets, activeVehicles] = await Promise.all([
      User.count(),
      Branch.count(),
      Contact.count(),
      Vehicle.count(),
      Appointment.count(),
      Helpdesk.count(),
      PhoneCall.count(),
      Appointment.count({ where: { appointment_date: { [Op.gte]: startOfToday, [Op.lt]: endOfToday } } }),
      Helpdesk.count({ where: { status: ['open', 'in_progress'] } }),
      Vehicle.count({ where: { status: 'available' } })
    ]);

    Object.assign(counts, {
      users,
      branches,
      contacts,
      vehicles,
      appointments,
      tickets,
      phone_calls: phoneCalls,
      today_appointments: todayAppointments,
      open_tickets: openTickets,
      active_vehicles: activeVehicles
    });
  }

  const memory = process.memoryUsage();
  const totalMemoryMb = toMegabytes(os.totalmem());
  const freeMemoryMb = toMegabytes(os.freemem());
  const usedMemoryMb = totalMemoryMb - freeMemoryMb;
  const databaseHealthy = database.status === 'healthy';

  res.json({
    success: true,
    data: {
      overall: databaseHealthy ? 'operational' : 'degraded',
      timestamp: new Date().toISOString(),
      api_latency_ms: Date.now() - startedAt,
      database,
      services: [
        { name: 'API', status: 'operational', latency_ms: Date.now() - startedAt },
        { name: 'Database', status: databaseHealthy ? 'operational' : 'error', latency_ms: database.latency_ms }
      ],
      server: {
        uptime_seconds: Math.floor(process.uptime()),
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        hostname: os.hostname(),
        cpu_count: os.cpus().length,
        cpu_model: os.cpus()[0]?.model || 'Unknown',
        load_avg_1m: os.loadavg()[0],
        load_avg_5m: os.loadavg()[1]
      },
      memory: {
        used_mb: usedMemoryMb,
        total_mb: totalMemoryMb,
        free_mb: freeMemoryMb,
        usage_pct: totalMemoryMb ? Math.round((usedMemoryMb / totalMemoryMb) * 100) : 0,
        heap_used_mb: toMegabytes(memory.heapUsed),
        heap_total_mb: toMegabytes(memory.heapTotal),
        rss_mb: toMegabytes(memory.rss)
      },
      stats: counts
    }
  });
};

export default { getSystemStatus };
