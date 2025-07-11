@@ .. @@
   return (
     <div className="space-y-12 md:space-y-16 py-8" dir="rtl">
+      <ErrorBoundary>
+        <OfflineWrapper requiresNetwork={true}>
           <section className="container mx-auto px-4 text-center">
             <div className="inline-block p-4 bg-primary/10 rounded-full mb-6 mx-auto">
                 <Compass className="h-12 w-12 text-primary" />

@@ .. @@
               </a>
             </TooltipContent>
           </Tooltip>
+        </OfflineWrapper>
+      </ErrorBoundary>
     </div>
   );
 }