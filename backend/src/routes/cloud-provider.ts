import express from 'express';
import { CloudProviderController } from '../controllers/cloudProviderController';
import { checkRole, ROLES } from '../middleware/auth';

const router = express.Router();
const cloudProviderController = new CloudProviderController();

/**
 * @route   POST /api/cloud-provider/register
 * @desc    Register as a cloud provider
 * @access  Private (any authenticated user)
 */
router.post(
  '/register',
  cloudProviderController.registerProvider
);

/**
 * @route   GET /api/cloud-provider/nodes
 * @desc    Get all nodes for the authenticated provider
 * @access  Private (cloud-provider)
 */
router.get(
  '/nodes',
  checkRole(ROLES.CLOUD_PROVIDER),
  cloudProviderController.getProviderNodes
);

/**
 * @route   POST /api/cloud-provider/nodes
 * @desc    Add a new node
 * @access  Private (cloud-provider)
 */
router.post(
  '/nodes',
  checkRole(ROLES.CLOUD_PROVIDER),
  cloudProviderController.addNode
);

/**
 * @route   POST /api/cloud-provider/maintenance
 * @desc    Schedule maintenance for a node
 * @access  Private (cloud-provider)
 */
router.post(
  '/maintenance',
  checkRole(ROLES.CLOUD_PROVIDER),
  cloudProviderController.scheduleMaintenance
);

/**
 * @route   GET /api/cloud-provider/maintenance
 * @desc    Get all scheduled maintenance for provider's nodes
 * @access  Private (cloud-provider)
 */
router.get(
  '/maintenance',
  checkRole(ROLES.CLOUD_PROVIDER),
  cloudProviderController.getScheduledMaintenance
);

/**
 * @route   GET /api/cloud-provider/profile
 * @desc    Get provider profile
 * @access  Private (cloud-provider)
 */
router.get(
  '/profile',
  checkRole(ROLES.CLOUD_PROVIDER),
  cloudProviderController.getProviderProfile
);

/**
 * @route   PUT /api/cloud-provider/profile
 * @desc    Update provider profile
 * @access  Private (cloud-provider)
 */
router.put(
  '/profile',
  checkRole(ROLES.CLOUD_PROVIDER),
  cloudProviderController.updateProviderProfile
);

export default router;