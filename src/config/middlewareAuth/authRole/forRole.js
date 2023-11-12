export const policyRoles = (roles) => {
    return (req, res, next) => {
        const role = req.user.role; // Aquí asumo que el rol se envía como un parámetro de la URL

        if (!role) {
            return res.status(400).json({ status: "error", error: "No se proporcionaron roles permitidos" });
        }

        if (roles.includes(role)) {
            return next();
        } else {
            return res.status(403).json({ status: "error", error: "No está autorizado" });
        }
    };
};








