import { defineEventHandler } from 'h3';
import { oauthPage } from '../../utils/oauthPage';

export default defineEventHandler((event) => oauthPage(event, 'consent'));
