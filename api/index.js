const { createClient } = require('@supabase/supabase-js');

// 1. Nos conectamos a tu base de datos usando variables de entorno (por seguridad)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    try {
        // 2. Buscamos tu contador actual en la tabla que creamos
        const { data, error } = await supabase
            .from('profile_views')
            .select('view_count')
            .eq('username', 'jussepe06')
            .single();

        if (error) throw error;

        // 3. ¡Sumamos 1 a la visita!
        let count = data ? data.view_count : 0;
        count += 1;

        // 4. Actualizamos el nuevo número en la base de datos
        await supabase
            .from('profile_views')
            .update({ view_count: count })
            .eq('username', 'jussepe06');

        // 5. Dibujamos el SVG. 
        // Nota: GitHub no permite cargar GIFs externos dentro de un SVG por seguridad, 
        // así que diseñaremos una "tarjeta" limpia, profesional y oscura con un emoji de pato.
        const svg = `
    <svg width="260" height="80" xmlns="http://www.w3.org/2000/svg">
      <!-- Fondo oscuro y borde -->
      <rect width="260" height="80" rx="10" fill="#1e1e2e" stroke="#89b4fa" stroke-width="2"/>
      
      <!-- Texto superior -->
      <text x="20" y="30" font-family="Arial, sans-serif" font-size="14" fill="#cdd6f4" font-weight="bold">Visitantes de jussepe06</text>
      
      <!-- Emoji del Pato -->
      <text x="20" y="62" font-size="24">🦆</text>
      
      <!-- Cartelito donde va el número -->
      <rect x="60" y="42" width="180" height="26" rx="5" fill="#f38ba8" />
      
      <!-- El número dinámico -->
      <text x="150" y="61" font-family="monospace" font-size="18" font-weight="bold" fill="#11111b" text-anchor="middle">
        ${count}
      </text>
    </svg>
    `;

        // 6. Engañamos a GitHub: le decimos que somos una imagen y que NO guarde caché
        // Esto obliga a GitHub a recargar el número cada vez que alguien entra a tu perfil.
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // 7. Entregamos la imagen al usuario
        res.status(200).send(svg);

    } catch (err) {
        // Si algo explota, mostramos un error elegante en formato SVG
        res.status(500).send('<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg"><text y="15" fill="red">Error DB</text></svg>');
    }
};