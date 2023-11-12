import SessionsRepository from '../daos/repositories/session.repository.js';

class SessionsController {
    async register(req, res, next) {
        await SessionsRepository.register(req, res, next);
    }

    async login(req, res) {
        await SessionsRepository.login(req, res);
    }

    async resetPassword(req, res) {
        await SessionsRepository.resetPassword(req, res);
    }

    async sendEmailToken(req, res) {
        await SessionsRepository.sendEmailToken(req, res)
    }

    async verifyToken(req, res) {
        await SessionsRepository.verifyToken(req, res)
    }

    async gitHub(req, res) {
        await SessionsRepository.gitHub(req, res)
    }

    async gitHubCallback(req, res) {
        await SessionsRepository.gitHubCallback(req, res)
    }

    async logout(req, res) {
        await SessionsRepository.logout(req, res);
    }

    async current(req, res) {
        await SessionsRepository.current(req, res);
    }
}

export default new SessionsController();
