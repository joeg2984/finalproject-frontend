import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const useTabAnimation = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const previousIndex = useRef(0);

    const animate = useCallback((newIndex) => {
        setDirection(newIndex > previousIndex.current ? 1 : -1);
        previousIndex.current = activeIndex;
        setActiveIndex(newIndex);
    }, [activeIndex]);

    return { activeIndex, direction, animate };
};

const TabIndicator = ({ width, x }) => (
    <motion.div
        className="absolute bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        initial={false}
        animate={{ width, x }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
);

const AnimatedTab = ({ children, isActive, onClick, indicator }) => (
    <motion.button
        className={clsx(
            "relative px-4 py-2 text-sm font-medium transition-colors flex items-center",
            {
                'text-indigo-600': isActive,
                'text-gray-600 hover:text-gray-800': !isActive,
            }
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        ref={indicator}
    >
        <span className="relative z-10 flex items-center">
            {children}
            <AnimatePresence>
                {isActive && (
                    <motion.span
                        key="icon"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight className="ml-2 w-4 h-4" />
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
        {isActive && (
            <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg shadow-lg"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
    </motion.button>
);

const AnimatedContent = ({ children, direction }) => (
    <motion.div
        initial={{ x: 50 * direction, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50 * direction, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="p-4 bg-white rounded-lg shadow-md"
    >
        {children}
    </motion.div>
);

export { useTabAnimation, TabIndicator, AnimatedTab, AnimatedContent };