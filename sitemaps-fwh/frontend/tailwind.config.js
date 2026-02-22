import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                'max-contrast-sm': '0 1px 2px 0 hsl(var(--foreground) / 0.15)',
                'max-contrast-md': '0 4px 6px -1px hsl(var(--foreground) / 0.15), 0 2px 4px -1px hsl(var(--foreground) / 0.08)',
                'max-contrast-lg': '0 10px 15px -3px hsl(var(--foreground) / 0.15), 0 4px 6px -2px hsl(var(--foreground) / 0.08)',
                'max-contrast-xl': '0 20px 25px -5px hsl(var(--foreground) / 0.15), 0 10px 10px -5px hsl(var(--foreground) / 0.06)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' }
                },
                'slide-up': {
                    from: { transform: 'translateY(10px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-up 0.3s ease-out'
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                '7xl': ['4.5rem', { lineHeight: '1' }]
            },
            fontWeight: {
                'max-contrast': '500',
                'max-contrast-bold': '600',
                'max-contrast-heavy': '700'
            }
        }
    },
    plugins: [
        typography,
        containerQueries,
        animate,
        // Enhanced plugin for maximum contrast utilities
        function({ addUtilities, theme }) {
            const newUtilities = {
                '.text-max-readable': {
                    color: 'hsl(var(--foreground))',
                    fontWeight: '500',
                    textRendering: 'optimizeLegibility',
                    '-webkit-font-smoothing': 'antialiased',
                    '-moz-osx-font-smoothing': 'grayscale'
                },
                '.text-max-readable-muted': {
                    color: 'hsl(var(--muted-foreground))',
                    fontWeight: '500',
                    textRendering: 'optimizeLegibility',
                    '-webkit-font-smoothing': 'antialiased',
                    '-moz-osx-font-smoothing': 'grayscale'
                },
                '.bg-max-readable': {
                    backgroundColor: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))'
                },
                '.bg-max-readable-card': {
                    backgroundColor: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))'
                },
                '.border-max-readable': {
                    borderColor: 'hsl(var(--border))'
                },
                '.shadow-max-readable': {
                    boxShadow: '0 4px 6px -1px hsl(var(--foreground) / 0.15), 0 2px 4px -1px hsl(var(--foreground) / 0.08)'
                },
                '.force-max-contrast': {
                    color: 'hsl(var(--foreground)) !important',
                    fontWeight: '500 !important',
                    textRendering: 'optimizeLegibility !important',
                    '-webkit-font-smoothing': 'antialiased !important',
                    '-moz-osx-font-smoothing': 'grayscale !important'
                },
                '.force-max-contrast-bg': {
                    backgroundColor: 'hsl(var(--background)) !important',
                    color: 'hsl(var(--foreground)) !important'
                },
                '.force-max-contrast-card': {
                    backgroundColor: 'hsl(var(--card)) !important',
                    color: 'hsl(var(--card-foreground)) !important',
                    borderColor: 'hsl(var(--border)) !important'
                },
                '.interactive-max-readable': {
                    color: 'hsl(var(--foreground))',
                    backgroundColor: 'transparent',
                    borderColor: 'hsl(var(--border))',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                },
                '.interactive-max-readable:hover': {
                    color: 'hsl(var(--primary))',
                    backgroundColor: 'hsl(var(--accent) / 0.1)',
                    borderColor: 'hsl(var(--accent))'
                },
                '.interactive-max-readable:focus': {
                    color: 'hsl(var(--primary))',
                    backgroundColor: 'hsl(var(--accent) / 0.1)',
                    borderColor: 'hsl(var(--accent))',
                    outline: '2px solid hsl(var(--primary))',
                    outlineOffset: '2px'
                }
            }
            addUtilities(newUtilities)
        }
    ]
};
